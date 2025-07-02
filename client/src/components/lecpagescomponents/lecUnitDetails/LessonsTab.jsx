import React from "react";

// Component to display the Lessons tab content
const LessonsTab = ({ unit }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg w-full">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">Lessons</h3>
      <p className="text-neutral-600">
        This section will display lessons for {unit.title}. (Placeholder content)
      </p>
    </div>
  );
};

export default LessonsTab;