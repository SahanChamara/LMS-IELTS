import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MessageCircle, BookOpen, File, X } from 'lucide-react';
import { mockPosts } from '../../data/mockData';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/card';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/store-config/store';
import { getStudentDetailsAPI } from '../../redux/features/studentSlice';
import { createPost, getPostsByCourseId, reactPost, removeReaction, updateReaction, commentPost } from '../../service/postService';
import { uploadFileToS3, validateS3Config } from '../../service/s3/s3Service';

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StudentFeed = () => {
  // State
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});
  const { student, loading, error } = useAppSelector((state) => state.students);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);

  // Derived data
  const currentUser = {
    id: localStorage.getItem('user'),
    name: student?.name || 'User',
    role: 'student',
  };
  const courseId = student?.enrolledCourse?._id;

  // Function to fetch posts
  const fetchPosts = async () => {
    if (courseId) {
      try {
        const response = await getPostsByCourseId(courseId, { status: 'approved' });
        // Ensure each post has a reactions array
        const normalizedPosts = (response.posts || []).map(post => ({
          ...post,
          reactions: post.reactions || [],
        }));
        setPosts(normalizedPosts);
      } catch (err) {
        toast.error('Failed to fetch posts: ' + err.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  // Debug environment variables on mount
  useEffect(() => {
    validateS3Config();
  }, []);

  // Fetch student details and posts
  useEffect(() => {
    const studentId = localStorage.getItem('user');
    if (studentId) {
      dispatch(getStudentDetailsAPI(studentId));
    } else {
      toast.error('User ID not found in localStorage. Please log in again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    fetchPosts();
  }, [dispatch, courseId]);

  // Handle file selection and upload
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setAttachmentUrl(''); // Reset attachment URL
    if (!file) return;

    toast.info(`Selected: ${file.name} (${formatFileSize(file.size)})`, {
      position: 'top-right',
      autoClose: 3000,
    });

    await uploadFileToS3(file, setIsUploading, setAttachmentUrl);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle discard post
  const handleDiscardPost = () => {
    setNewPost('');
    setSelectedFile(null);
    setAttachmentUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Post discarded', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPost.trim() && !attachmentUrl) {
      toast.error('Please add some content or upload a file to share', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-red-100 text-red-800 border border-red-200',
      });
      return;
    }

    if (!courseId) {
      toast.error('Course ID not available. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!currentUser.id) {
      toast.error('User ID not available. Please log in again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsPosting(true);
    try {
      const postData = {
        textContent: newPost,
        attachments: attachmentUrl
          ? [{
              name: selectedFile?.name || 'Unknown',
              type: selectedFile?.type || 'application/octet-stream',
              size: selectedFile?.size || 0,
              url: attachmentUrl,
            }]
          : [],
        visibility: 'public',
        course: courseId,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
      };
      await createPost(postData);
      toast.success('Your post has been submitted for approval and will appear in the feed once approved.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-blue-100 text-blue-800 border border-blue-200',
      });

      setNewPost('');
      setSelectedFile(null);
      setAttachmentUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error('Error creating post: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsPosting(false);
    }
  };

  // Handle reaction to a post
  const handleReaction = async (postId, type) => {
    try {
      if (!currentUser.id) {
        throw new Error('User ID not available. Please log in again.');
      }
      console.log('Handling reaction:', { postId, type, userId: currentUser.id });

      const reactionData = { type, userId: currentUser.id, userName: currentUser.name };
      const post = posts.find(p => p._id === postId);
      const existingReaction = post?.reactions?.find(r => r.userId === currentUser.id);

      if (existingReaction && existingReaction.type === type) {
        // Remove reaction if clicking the same type
        console.log('Removing reaction for user:', currentUser.id);
        await removeReaction(postId, currentUser.id);
        setPosts(posts.map(p =>
          p._id === postId
            ? { ...p, reactions: p.reactions.filter(r => r.userId !== currentUser.id) }
            : p
        ));
      } else if (existingReaction) {
        // Update existing reaction to new type
        await updateReaction(postId, reactionData);
        setPosts(posts.map(p =>
          p._id === postId
            ? {
                ...p,
                reactions: p.reactions.map(r =>
                  r.userId === currentUser.id ? { ...r, type, createdAt: new Date() } : r
                )
              }
            : p
        ));
      } else {
        // Add new reaction
        await reactPost(postId, reactionData);
        setPosts(posts.map(p =>
          p._id === postId
            ? {
                ...p,
                reactions: [...p.reactions, {
                  postId,
                  type,
                  userId: currentUser.id,
                  userName: currentUser.name,
                  createdAt: new Date()
                }]
              }
            : p
        ));
      }
      await fetchPosts(); // Refresh posts to ensure consistency with server
    } catch (error) {
      console.error('Reaction error:', error);
      toast.error('Error handling reaction: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle comment submission
  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (!commentText?.trim()) return;

    try {
      if (!currentUser.id) {
        throw new Error('User ID not available. Please log in again.');
      }
      const commentData = {
        content: commentText,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
      };
      const response = await commentPost(postId, commentData);
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, comments: [{ ...response.comments[response.comments.length - 1], _id: new Date().toISOString() }, ...post.comments] }
          : post
      ));
      setNewComments({ ...newComments, [postId]: '' });
    } catch (error) {
      toast.error('Error adding comment: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading student details...</div>;
  }

  if (error) {
    toast.error(error, {
      position: 'top-right',
      autoClose: 3000,
    });
  }

  return (
    <div className="flex h-screen bg-gray-50 text-neutral-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Study Feed
          </h1>

          {/* Create Post Form */}
          <Card>
            <motion.div className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-700 font-semibold text-lg">
                    {currentUser.name.charAt(0)}
                  </span>
                </div>
                <input
                  id="post-content"
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isPosting || !!attachmentUrl}
                  className={`text-sm px-3 py-1 border rounded-md shadow-sm transition duration-300 ease-in-out ${
                    isUploading || isPosting || !!attachmentUrl
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <File className="h-5 w-5 inline-block mr-1" />
                  {isUploading ? 'Uploading...' : 'Add File'}
                </button>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf,.docx"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <button
                  onClick={handleCreatePost}
                  disabled={isUploading || isPosting}
                  className={`text-sm px-3 py-1 border rounded-md shadow-sm transition duration-300 ease-in-out ${
                    isUploading || isPosting
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
                {attachmentUrl && (
                  <button
                    onClick={handleDiscardPost}
                    className="text-sm px-3 py-1 border rounded-md shadow-sm transition duration-300 ease-in-out bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <X className="h-5 w-5 inline-block mr-1" />
                    Discard Post
                  </button>
                )}
              </div>
              {selectedFile && (
                <p className="text-xs text-gray-600 mt-2 ml-12">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  {attachmentUrl && ' - Uploaded'}
                </p>
              )}
            </motion.div>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6 mt-6">
            {posts.length === 0 ? (
              <Card>
                <motion.div className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    No Posts Available
                  </h3>
                  <p className="text-gray-600 text-center">
                    There are currently no posts in the feed. Share your study materials to get started!
                  </p>
                </motion.div>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post._id}>
                  <motion.div className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6">
                    <div className="border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-700 font-semibold text-lg">
                              {post.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{post.userName}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs font-normal mr-2">
                                {post.userRole}
                              </span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {post.textContent && (
                        <p className="text-gray-800 mb-3 leading-relaxed">{post.textContent}</p>
                      )}

                      <AttachmentDisplay attachments={post.attachments} />

                      <ReactionBar
                        reactions={post.reactions}
                        currentUserId={currentUser.id}
                        currentUserName={currentUser.name}
                        onReaction={(type) => handleReaction(post._id, type)}
                      />

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <button
                          className="flex items-center space-x-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleComments(post._id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{post.comments.length} Comments</span>
                        </button>
                      </div>

                      {expandedComments.has(post._id) && (
                        <div className="mt-4 space-y-3">
                          <div className="flex space-x-2">
                            <input
                              placeholder="Add a comment..."
                              value={newComments[post._id] || ''}
                              onChange={(e) => setNewComments({
                                ...newComments,
                                [post._id]: e.target.value
                              })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post._id);
                                }
                              }}
                              className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                            />
                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                newComments[post._id]?.trim()
                                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              } transition-colors duration-150`}
                              onClick={() => handleAddComment(post._id)}
                              disabled={!newComments[post._id]?.trim()}
                            >
                              Post
                            </button>
                          </div>

                          {post.comments.map((comment) => (
                            <div key={comment._id} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                                <span className="text-xs text-gray-600 capitalize">
                                  {comment.userRole}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default StudentFeed;