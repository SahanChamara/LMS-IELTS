import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MessageCircle, BookOpen, Image } from 'lucide-react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockPosts, currentUser } from '../../data/mockData';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/card';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/store-config/store';
import { getStudentDetailsAPI } from '../../redux/features/studentSlice';
import { createPost, getPostsByCourseId, reactPost, commentPost } from '../../service/postService';

// S3 Configuration
const S3ClientConfig = {
  region: import.meta.env.VITE_S3_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY || '',
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY || '',
  },
};

// Validate S3 configuration
const validateS3Config = () => {
  const missing = [];
  if (!import.meta.env.VITE_S3_ACCESS_KEY) missing.push('VITE_S3_ACCESS_KEY');
  if (!import.meta.env.VITE_S3_SECRET_ACCESS_KEY) missing.push('VITE_S3_SECRET_ACCESS_KEY');
  if (!import.meta.env.VITE_S3_BUCKET_NAME) missing.push('VITE_S3_BUCKET_NAME');
  if (!import.meta.env.VITE_S3_REGION) missing.push('VITE_S3_REGION');
  if (missing.length > 0) {
    console.error('Missing S3 configuration:', missing.join(', '));
    toast.error(`Missing AWS configuration: ${missing.join(', ')}`, {
      position: 'top-right',
      autoClose: 5000,
    });
    return false;
  }
  return true;
};

const StudentFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});
  const { student, loading, error } = useAppSelector((state) => state.students);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);

  const currentUser = {
    id: localStorage.getItem('user'),
    name: student?.name || 'User',
    role: 'student',
  };

  const courseId = student?.enrolledCourse?._id;

  // Debug environment variables
  useEffect(() => {
    console.log('Environment variables:', {
      VITE_S3_ACCESS_KEY: import.meta.env.VITE_S3_ACCESS_KEY ? 'Set' : 'Missing',
      VITE_S3_SECRET_ACCESS_KEY: import.meta.env.VITE_S3_SECRET_ACCESS_KEY ? 'Set' : 'Missing',
      VITE_S3_BUCKET_NAME: import.meta.env.VITE_S3_BUCKET_NAME,
      VITE_S3_REGION: import.meta.env.VITE_S3_REGION,
    });
    validateS3Config();
  }, []);

  // Fetch student details and posts
  useEffect(() => {
    const studentId = localStorage.getItem('user');
    if (studentId) {
      dispatch(getStudentDetailsAPI(studentId));
    }

    if (courseId) {
      getPostsByCourseId(courseId, { status: 'approved' })
        .then((response) => {
          setPosts(response.posts || []);
        })
        .catch((err) => {
          toast.error('Failed to fetch posts: ' + err.message, {
            position: 'top-right',
            autoClose: 3000,
          });
        });
    }
  }, [dispatch, courseId]);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setAttachmentUrl(''); // Reset attachment URL when new file is selected
    if (!file) {
      toast.error('No file selected', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    toast.info(`Selected: ${file.name} (${formatFileSize(file.size)})`, {
      position: 'top-right',
      autoClose: 3000,
    });

    // Automatically upload to S3
    if (!validateS3Config()) {
      setIsUploading(false);
      return;
    }

    const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

    try {
      setIsUploading(true);
      const s3Client = new S3Client(S3ClientConfig);
      const arrayBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `media/${file.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
        ACL: 'public-read', // Ensure file is publicly accessible
      });

      await s3Client.send(command);
      const url = `https://${bucketName}.s3.${S3ClientConfig.region}.amazonaws.com/media/${file.name}`;
      console.log('S3 Upload URL:', url);
      setAttachmentUrl(url);

      toast.success('Image uploaded successfully!', {
        position: 'top-right',
        autoClose: 3000,
        className: 'bg-green-100 text-green-800 border border-green-200',
      });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Image upload failed: ${err.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
      // Clear file input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && !attachmentUrl) {
      toast.error('Please add some content or upload an image to share', {
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

    try {
      const postData = {
        textContent: newPost,
        attachments: attachmentUrl
          ? [{
              name: selectedFile?.name || 'Unknown',
              type: selectedFile?.type || 'image/jpeg',
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
      console.log('Sending postData to backend:', postData);
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
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      const existingReaction = posts.find(post => post._id === postId)?.reactions.find(r => r.userId === currentUser.id);
      if (existingReaction && existingReaction.type === type) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, reactions: post.reactions.filter(r => r.userId !== currentUser.id) }
            : post
        ));
        return;
      }

      const reactionData = { type, userId: currentUser.id, userName: currentUser.name };
      const response = await reactPost(postId, reactionData);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, reactions: [...post.reactions.filter(r => r.userId !== currentUser.id), response.data] }
          : post
      ));
    } catch (error) {
      toast.error('Error adding reaction: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (!commentText?.trim()) return;

    try {
      const commentData = {
        content: commentText,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
      };
      const response = await commentPost(postId, commentData);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [response.data, ...post.comments] }
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

  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Study Feed
          </h1>
          {/* Create Post Form */}
          <Card>
            <motion.div
              className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6"
            >
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
                  disabled={isUploading}
                  className={`text-sm px-3 py-1 border rounded-md shadow-sm transition duration-300 ease-in-out ${
                    isUploading
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Image className="h-5 w-5 inline-block mr-1" />
                  {isUploading ? 'Uploading...' : 'Add File'}
                </button>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <button
                  onClick={handleCreatePost}
                  disabled={isUploading}
                  className={`text-sm px-3 py-1 border rounded-md shadow-sm transition duration-300 ease-in-out ${
                    isUploading
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  Post
                </button>
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
                <motion.div
                  className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12"
                >
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
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
                  <motion.div
                    className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6"
                  >
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