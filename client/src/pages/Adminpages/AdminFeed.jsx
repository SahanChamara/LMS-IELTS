import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock, CheckCircle, XCircle, AlertTriangle, BookOpen, File, MessageCircle } from 'lucide-react';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';
import Adminsidebar from './Adminsidebars';
import Card from '../../components/card';
import { getPosts, approvePost, deletePost, reactPost } from '../../service/postService';

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AdminFeed = () => {
  // State
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('approved');
  const [isLoading, setIsLoading] = useState(false);

  // Current user (admin)
  const currentUser = { id: localStorage.getItem('user') || '3', name: 'Admin User', role: 'admin' };

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await getPosts({}); // Fetch all posts without status filter
        const allPosts = response.posts.map(post => ({
          ...post,
          id: post._id, // Map _id to id for UI consistency
          createdAt: new Date(post.createdAt),
        }));
        // Filter posts client-side
        setPosts(allPosts.filter(post => post.status === 'approved') || []);
        setPendingPosts(allPosts.filter(post => post.status === 'pending') || []);
      } catch (err) {
        toast.error('Failed to fetch posts: ' + err.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle approve post
  const handleApprovePost = async (postId) => {
    try {
      const post = pendingPosts.find(p => p.id === postId);
      if (!post) return;

      await approvePost(postId, 'approved');
      const approvedPost = { ...post, status: 'approved' };
      setPosts([approvedPost, ...posts]);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      toast.success(`Post by ${post.userName} has been approved`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-teal-100 text-teal-800 border border-teal-200',
      });
    } catch (error) {
      toast.error('Error approving post: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle reject post
  const handleRejectPost = async (postId) => {
    try {
      const post = pendingPosts.find(p => p.id === postId);
      if (!post) return;

      await approvePost(postId, 'rejected');
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      toast.error(`Post by ${post.userName} has been rejected`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-red-100 text-red-800 border border-red-200',
      });
    } catch (error) {
      toast.error('Error rejecting post: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      toast.error('The post has been removed from the feed', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-red-100 text-red-800 border border-red-200',
      });
    } catch (error) {
      toast.error('Error deleting post: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle reaction
  const handleReaction = async (postId, type) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const existingReaction = post.reactions.find(r => r.userId === currentUser.id);
      if (existingReaction && existingReaction.type === type) {
        // Remove reaction (simplified, assuming backend handles removal)
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, reactions: p.reactions.filter(r => r.userId !== currentUser.id) }
            : p
        ));
        return;
      }

      const reactionData = { type, userId: currentUser.id, userName: currentUser.name };
      const response = await reactPost(postId, reactionData);
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, reactions: [...p.reactions.filter(r => r.userId !== currentUser.id), response.data] }
          : p
      ));
    } catch (error) {
      toast.error('Error adding reaction: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Render post
  const renderPost = (post, showActions = false) => (
    <Card key={post.id}>
      <div
        className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 hover:scale-102 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out"
        style={{ border: "none" }}
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
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                post.status === 'approved'
                  ? 'bg-teal-100 text-teal-800 border-teal-200'
                  : post.status === 'pending'
                  ? 'bg-gray-50 text-gray-500 border-gray-200'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}>
                {post.status}
              </span>
              {post.userRole === 'instructor' && (
                <span className="px-2 py-0.5 text-xs font-normal border border-gray-200 rounded-full text-gray-500 bg-white">
                  Auto-approved
                </span>
              )}
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
            <div className="flex items-center space-x-1 text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments.length} Comments</span>
            </div>
          </div>

          {showActions && (
            <div className="flex space-x-2 mt-4">
              {post.status === 'pending' && (
                <>
                  <button
                    className="flex-1 flex items-center justify-center px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-150 text-sm"
                    onClick={() => handleApprovePost(post.id)}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center px-3 py-1 border border-gray-200 text-red-700 rounded-md hover:bg-red-100 transition-colors duration-150 text-sm"
                    onClick={() => handleRejectPost(post.id)}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </button>
                </>
              )}
              {post.status === 'approved' && (
                <button
                  className="flex-1 flex items-center justify-center px-3 py-1 border border-gray-200 text-red-700 rounded-md hover:bg-red-100 transition-colors duration-150 text-sm"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Adminsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            Study Feed
          </h1>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <div className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12">
                <p className="text-gray-600">Loading posts...</p>
              </div>
            </Card>
          )}

          {/* Tab Navigation */}
          {!isLoading && (
            <div className="bg-gray-100 border border-gray-200 rounded-md mb-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    activeTab === 'approved'
                      ? 'text-gray-900 font-semibold border-b-2 border-teal-500 bg-gray-200/60'
                      : 'text-gray-600 font-medium hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'approved'}
                  tabIndex={0}
                >
                  <CheckCircle className="inline-block mr-1.5 h-3.5 w-3.5 align-text-bottom" />
                  Approved <span className="text-xs font-normal">({posts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                    activeTab === 'pending'
                      ? 'text-gray-900 font-semibold border-b-2 border-teal-500 bg-gray-200/60'
                      : 'text-gray-600 font-medium hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'pending'}
                  tabIndex={0}
                >
                  <Clock className="inline-block mr-1.5 h-3.5 w-3.5 align-text-bottom" />
                  Pending <span className="text-xs font-normal">({pendingPosts.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <div className="space-y-6">
              {activeTab === 'approved' && (
                <>
                  {posts.length === 0 ? (
                    <Card>
                      <div
                        className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12 hover:scale-102 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out"
                        style={{ border: "none" }}
                      >
                        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Posts Available
                        </h3>
                        <p className="text-gray-600 text-center">
                          There are currently no approved posts in the feed.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    posts.map((post) => renderPost(post, true))
                  )}
                </>
              )}

              {activeTab === 'pending' && (
                <>
                  {pendingPosts.length === 0 ? (
                    <Card>
                      <div
                        className="rounded-2xl shadow-sm bg-white/10 backdrop-blur-lg p-6 flex flex-col items-center justify-center py-12 hover:scale-102 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out"
                        style={{ border: "none" }}
                      >
                        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Posts Pending
                        </h3>
                        <p className="text-gray-600 text-center">
                          There are currently no posts pending approval.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    pendingPosts.map((post) => renderPost(post, true))
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default AdminFeed;