import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPosts } from '../../data/mockData';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';

const InstructorFeed = () => {
  const [posts, setPosts] = useState(mockPosts.filter(p => p.status === 'approved'));
  const [pendingPosts, setPendingPosts] = useState(mockPosts.filter(p => p.status === 'pending'));
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});

  const currentUser = { id: '2', name: 'Dr. Smith', role: 'instructor' };

  const handleCreatePost = () => {
    if (!newPost.trim() && !selectedFile) {
      toast.error("Please add some content or upload a file", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const newPostObj = {
      id: Date.now().toString(),
      textContent: newPost,
      attachments: selectedFile ? [{
        id: Date.now().toString(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        url: '#'
      }] : [],
      visibility: 'public',
      status: 'approved',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      createdAt: new Date(),
      reactions: [],
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    toast.success("Your post has been published to the feed", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    setNewPost('');
    setSelectedFile(null);
  };

  const handleApprovePost = (postId) => {
    const post = pendingPosts.find(p => p.id === postId);
    if (post) {
      const approvedPost = { ...post, status: 'approved' };
      setPosts([approvedPost, ...posts]);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      toast.success(`Post by ${post.userName} has been approved`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRejectPost = (postId) => {
    const post = pendingPosts.find(p => p.id === postId);
    if (post) {
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      toast.error(`Post by ${post.userName} has been rejected`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Study Feed - Instructor View
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Share Learning Resources</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">
                    What would you like to share?
                  </label>
                  <textarea
                    id="post-content"
                    placeholder="Share lecture notes, assignments, or study materials..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                    Upload File (PDF, DOCX, PNG, JPG)
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreatePost}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {post.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{post.userName}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {post.userRole} • {post.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {post.textContent && (
                      <p className="text-gray-700 mb-4">{post.textContent}</p>
                    )}
                    
                    <AttachmentDisplay attachments={post.attachments} />

                    <ReactionBar
                      reactions={post.reactions}
                      currentUserId={currentUser.id}
                      currentUserName={currentUser.name}
                      onReaction={(type) => handleReaction(post.id, type)}
                    />

                    <div className="mt-3 pt-3">
                      <button
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post.comments.length} Comments</span>
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
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            className={`px-3 py-1 rounded-md text-sm ${
                              newComments[post.id]?.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } transition-colors duration-200`}
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                          >
                            Post
                          </button>
                        </div>
                        
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {comment.userRole}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Posts Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Pending Approval ({pendingPosts.length})
                </h3>
              </div>
              <div className="p-4">
                {pendingPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No posts pending approval</p>
                ) : (
                  <div className="space-y-4">
                    {pendingPosts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-3 bg-yellow-50 border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-semibold">
                              {post.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{post.userName}</p>
                            <p className="text-xs text-gray-500">
                              {post.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {post.textContent}
                        </p>
                        
                        {post.attachments.length > 0 && (
                          <p className="text-xs text-gray-500 mb-3">
                            📎 {post.attachments.length} attachment(s)
                          </p>
                        )}
                        
                        <div className="flex space-x-2">
                          <button
                            className="flex-1 flex items-center justify-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                            onClick={() => handleApprovePost(post.id)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center px-3 py-1 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm"
                            onClick={() => handleRejectPost(post.id)}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default InstructorFeed;