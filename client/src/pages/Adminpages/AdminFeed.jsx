import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock, CheckCircle, XCircle, Users, FileText, MessageCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { mockPosts } from '../../data/mockData';
import ReactionBar from '../../components/ReactionBar';
import AttachmentDisplay from '../../components/AttachmentDisplay';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/card';

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
        className: 'bg-blue-100 text-blue-800 border border-blue-200',
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
        className: 'bg-red-100 text-red-800 border border-red-200',
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
      className: 'bg-red-100 text-red-800 border border-red-200',
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
    <Card key={post.id}>
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200">
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
                                ? 'bg-gray-50 text-gray-700 border-gray-200'
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
                                    className="flex-1 flex items-center justify-center px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors duration-150 text-sm"
                                    onClick={() => handleApprovePost(post.id)}
                                >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Approve
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center px-3 py-1 border border-gray-200 text-red-700 rounded hover:bg-red-50 transition-colors duration-150 text-sm"
                                    onClick={() => handleRejectPost(post.id)}
                                >
                                    <XCircle className="mr-1 h-4 w-4" />
                                    Reject
                                </button>
                            </>
                        )}
                        {post.status === 'approved' && (
                            <button
                                className="flex-1 flex items-center justify-center px-3 py-1 border border-gray-200 text-red-700 rounded hover:bg-red-100/50 transition-colors duration-150 text-sm"
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
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            Study Feed
          </h1>

          {/* Tab Navigation */}
          <div className="bg-gray-100 border border-gray-200 rounded-md  mb-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all duration-200 ease-in-out ${
                  activeTab === 'approved'
                    ? 'text-gray-900 font-semibold border-b-2 border-blue-500 bg-gray-200/60'
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
                className={`flex-1 py-1.5 px-3 rounded-md text-sm transition-all duration-200 ease-in-out  ${
                  activeTab === 'pending'
                    ? 'text-gray-900 font-semibold border-b-2 border-blue-500 bg-gray-200/60'
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

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'approved' && (
              <>
                {posts.length === 0 ? (
                  <Card>
                    <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center py-12">
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
                    <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center py-12">
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
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default AdminFeed;