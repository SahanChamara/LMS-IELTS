import React from "react";

// Component to display the Quizzes tab content
const QuizzesTab = ({ unit }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg w-full">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">Quizzes</h3>
      <p className="text-neutral-600">
        This section will display quizzes for {unit.title}. (Placeholder content)
      </p>
    </div>
  );
};

export default QuizzesTab;