import { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ id, title, description, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 flex items-start space-x-3 max-w-sm animate-slide-in">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        className="text-gray-500 hover:text-gray-700"
        onClick={() => onRemove(id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;