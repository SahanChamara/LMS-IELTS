import React from "react";

// Component to display the Discussions tab content
const DiscussionsTab = ({ unit }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg w-full">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">Discussions</h3>
      <p className="text-neutral-600">
        This section will display discussions for {unit.title}. (Placeholder content)
      </p>
    </div>
  );
};

export default DiscussionsTab;