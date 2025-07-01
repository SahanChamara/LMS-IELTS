import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock, CheckCircle, XCircle, Users, FileText, MessageCircle, AlertTriangle } from 'lucide-react';
import { mockPosts } from '../../data/mockData';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';

const AdminFeed = () => {
  const [posts, setPosts] = useState(mockPosts.filter(p => p.status === 'approved'));
  const [pendingPosts, setPendingPosts] = useState(mockPosts.filter(p => p.status === 'pending'));
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('approved');

  const currentUser = { id: '3', name: 'Admin User', role: 'admin' };

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
      const rejectedPost = { ...post, status: 'rejected' };
      setRejectedPosts([rejectedPost, ...rejectedPosts]);
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

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.error("The post has been removed from the feed", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPost = (post, showActions = false) => (
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
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              post.status === 'approved' ? 'bg-blue-100 text-blue-800' :
              post.status === 'pending' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {post.status}
            </span>
            {post.userRole === 'instructor' && (
              <span className="px-2 py-1 text-xs font-medium border border-gray-200 rounded-full text-gray-700">
                Auto-approved
              </span>
            )}
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

        <div className="flex items-center space-x-1 text-gray-500 mt-3 pt-3 border-t border-gray-200">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{post.comments.length} Comments</span>
        </div>

        {showActions && (
          <div className="flex space-x-2 mt-4">
            {post.status === 'pending' && (
              <>
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
              </>
            )}
            {post.status === 'approved' && (
              <button
                className="flex items-center justify-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                onClick={() => handleDeletePost(post.id)}
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Delete Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🛠️ Study Feed - Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {posts.length + pendingPosts.length + rejectedPosts.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPosts.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'approved'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Approved Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Posts ({pendingPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'rejected'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected Posts ({rejectedPosts.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'approved' && (
            <>
              {posts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No approved posts yet</p>
                  </div>
                </div>
              ) : (
                posts.map((post) => renderPost(post, true))
              )}
            </>
          )}

          {activeTab === 'pending' && (
            <>
              {pendingPosts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No posts pending approval</p>
                  </div>
                </div>
              ) : (
                pendingPosts.map((post) => renderPost(post, true))
              )}
            </>
          )}

          {activeTab === 'rejected' && (
            <>
              {rejectedPosts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-8 text-center">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No rejected posts</p>
                  </div>
                </div>
              ) : (
                rejectedPosts.map((post) => renderPost(post, false))
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminFeed;