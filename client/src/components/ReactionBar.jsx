import { ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const ReactionBar = ({ reactions = [], currentUserId, currentUserName, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    helpful: '👏',
    dislike: '👎'
  };
  console.log('Reactions:', reactions);
  const getUserReaction = () => {
    return reactions.find(r => r.userId == currentUserId);
  };

  const getReactionCount = (type) => {
    return reactions.filter(r => r.type === type).length;
  };

  const getTotalReactions = () => {
    return reactions.length;
  };

  const getReactionCounts = () => {
    const counts = {};
    Object.keys(reactionEmojis).forEach(type => {
      counts[type] = reactions.filter(r => r.type === type).length;
    });
    return counts;
  };

  const userReaction = getUserReaction();
  const reactionCounts = getReactionCounts();
  const totalReactions = getTotalReactions();

  const handleLikeButtonClick = () => {
    if (userReaction) {
      onReaction(userReaction.type);
    } else {
      onReaction('like');
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-t border-b border-gray-200">
      <div
        className="relative"
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        <button
          className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors duration-200 ${
            userReaction
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
          onClick={handleLikeButtonClick}
          aria-label={userReaction ? `Remove ${userReaction.type} reaction` : 'Like post'}
          tabIndex={0}
        >
          {userReaction ? (
            <span className="text-lg">{reactionEmojis[userReaction.type]}</span>
          ) : (
            <ThumbsUp size={15} />
          )}
          <span className="text-sm font-medium">
            {userReaction ? userReaction.type.charAt(0).toUpperCase() + userReaction.type.slice(1) : 'Like'}
          </span>
        </button>

        {/* Reaction Picker */}
        {showReactions && (
          <div
            className="absolute bottom-full left-0 mb-0 bg-white border border-gray-200 rounded-full shadow-lg p-2 flex space-x-2 z-10 transform transition-all duration-200 ease-in-out scale-100 opacity-100"
          >
            {Object.entries(reactionEmojis).map(([type, emoji]) => (
              <button
                key={type}
                onClick={() => {
                  onReaction(type);
                  setShowReactions(false);
                }}
                className={`p-1 rounded-full text-lg transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  userReaction?.type === type ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={`React with ${type}`}
                tabIndex={0}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reaction Summary: Only show total count */}
      {totalReactions > 0 && (
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <span className="flex -space-x-1">
            {Object.entries(reactionCounts)
              .filter(([_, count]) => count > 0)
              .slice(0, 3)
              .map(([type]) => (
                <span
                  key={type}
                  className="inline-block bg-white border border-gray-200 rounded-full px-1 text-base shadow-sm"
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  {reactionEmojis[type]}
                </span>
              ))}
          </span>
          <span>
            {totalReactions} {totalReactions === 1 ? 'person' : 'people'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReactionBar;