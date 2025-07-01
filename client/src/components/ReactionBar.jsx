import { useState } from 'react';

const ReactionBar = ({ reactions, currentUserId, currentUserName, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    celebrate: '🎉',
    support: '💪',
    insightful: '💡',
    funny: '😂'
  };

  const getUserReaction = () => {
    return reactions.find(r => r.userId === currentUserId);
  };

  const getReactionCount = (type) => {
    return reactions.filter(r => r.type === type).length;
  };

  const getTotalReactions = () => {
    return reactions.length;
  };

  const getTopReactions = () => {
    const counts = {};
    reactions.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  };

  const userReaction = getUserReaction();
  const totalReactions = getTotalReactions();
  const topReactions = getTopReactions();

  return (
    <div className="flex items-center space-x-4 pb-3 border-b border-gray-200">
      {/* Main reaction button */}
      <div className="relative">
        <button
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors duration-200 ${
            userReaction
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          onClick={() => onReaction(userReaction ? userReaction.type : 'like')}
        >
          {userReaction ? (
            <span className="text-sm">{reactionEmojis[userReaction.type]}</span>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m0-16l3.761.94c.159.04.322.06.485.06H15.263a2 2 0 011.789 1.106l3.5 7A2 2 0 0118.764 14H14"
              />
            </svg>
          )}
          <span className="text-sm font-medium">{userReaction ? userReaction.type : 'Like'}</span>
        </button>

        {/* Reaction picker */}
        {showReactions && (
          <div 
            className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1 z-10"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {Object.entries(reactionEmojis).map(([type, emoji]) => (
              <button
                key={type}
                onClick={() => {
                  onReaction(type);
                  setShowReactions(false);
                }}
                className="p-2 hover:scale-125 transition-transform duration-200 text-xl"
                title={type}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reaction summary */}
      {totalReactions > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <div className="flex -space-x-1">
            {topReactions.map(type => (
              <span key={type} className="text-xs bg-white rounded-full border border-gray-200 px-1">
                {reactionEmojis[type]}
              </span>
            ))}
          </div>
          <span>{totalReactions}</span>
        </div>
      )}
    </div>
  );
};

export default ReactionBar;