import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, MessageCircle, BookOpen, FileUp } from 'lucide-react';
import { mockPosts, currentUser } from '../data/mockData';
import ReactionBar from '../components/ReactionBar';
import AttachmentDisplay from '../components/AttachmentDisplay';
import Sidebar from '../components/Sidebar';
import Card from '../components/card';
import { motion } from 'framer-motion';

const StudentFeed = () => {
  const [posts, setPosts] = useState(mockPosts.filter(p => p.status === 'approved'));
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});

  const handleCreatePost = () => {
    if (!newPost.trim() && !selectedFile) {
      toast.error("Please add some content or upload a file to share", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-red-100 text-red-800 border border-red-200',
      });
      return;
    }

    toast.success("Your post has been submitted for approval and will be reviewed before appearing in the feed", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'bg-blue-100 text-blue-800 border border-blue-200',
    });

    setNewPost('');
    setSelectedFile(null);
  };

  const handleReaction = (postId, type) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find(r => r.userId === currentUser.id);
        if (existingReaction && existingReaction.type === type) {
          return {
            ...post,
            reactions: post.reactions.filter(r => r.userId !== currentUser.id)
          };
        } else {
          const newReactions = post.reactions.filter(r => r.userId !== currentUser.id);
          return {
            ...post,
            reactions: [...newReactions, {
              id: Date.now().toString(),
              type,
              userId: currentUser.id,
              userName: currentUser.name
            }]
          };
        }
      }
      return post;
    }));
  };

  const handleAddComment = (postId) => {
    const commentText = newComments[postId];
    if (!commentText?.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      content: commentText,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      createdAt: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [newComment, ...post.comments]
        };
      }
      return post;
    }));

    setNewComments({ ...newComments, [postId]: '' });
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
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
                style={{ border: "none" }}
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
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <FileUp className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleCreatePost}
                        className="text-sm px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                    >
                        Post
                    </button>
                </div>
                {selectedFile && (
                    <p className="text-xs text-gray-600 mt-2 ml-12">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                )}
            </motion.div>
        </Card>

        {/* Posts Feed */}
          <div className="space-y-6 mt-6">
            {posts.length === 0 ? (
              <Card>
                <motion.div
                  className="rounded-2xl shadow-sm  bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
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
                <Card key={post.id}>
                  <motion.div
                    className="rounded-2xl shadow-sm  bg-white/10 backdrop-blur-lg p-6"
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.3 }}
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
                              {post.createdAt.toLocaleDateString()}
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
                        onReaction={(type) => handleReaction(post.id, type)}
                      />

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <button
                          className="flex items-center space-x-1 text-gray-400 hover:text-gray-900"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{post.comments.length} Comments</span>
                        </button>
                      </div>

                      {expandedComments.has(post.id) && (
                        <div className="mt-4 space-y-3">
                          <div className="flex space-x-2">
                            <input
                              placeholder="Add a comment..."
                              value={newComments[post.id] || ''}
                              onChange={(e) => setNewComments({
                                ...newComments,
                                [post.id]: e.target.value
                              })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post.id);
                                }
                              }}
                              className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                            />
                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                newComments[post.id]?.trim()
                                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              } transition-colors duration-150`}
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComments[post.id]?.trim()}
                            >
                              Post
                            </button>
                          </div>

                          {post.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                                <span className="text-xs text-gray-600 capitalize">
                                  {comment.userRole}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {comment.createdAt.toLocaleDateString()}
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