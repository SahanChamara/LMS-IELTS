const QuizInstructions = ({ assessment, onStart, onCancel, attemptNumber, attemptsLeft }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{assessment.title || 'Untitled Assessment'}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>You can't go back after submitting</li>
              <li>Passing score: {assessment.passPercentage}%</li>
              {assessment.dueDate && (
                <li>Due: {new Date(assessment.dueDate).toLocaleDateString()}</li>
              )}
              <li>total {assessment.totalMarks} marks</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

QuizInstructions.propTypes = {
  assessment: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  attemptNumber: PropTypes.number.isRequired,
  attemptsLeft: PropTypes.number.isRequired,
};