import React from "react";

// Component to display the Overview tab content
const OverviewTab = ({ unit }) => {
  return (
    <div className="space-y-6">
      {/* Unit Code and Credits/Duration */}
      <div className="flex justify-between items-center text-neutral-600">
        <span>{unit.code}</span>
        <div className="flex space-x-4">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            4.25 Credits
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            8 Weeks
          </span>
        </div>
      </div>

      {/* Unit Description Section */}
      <div className="bg-gray-50 p-4 rounded-lg w-full">
        <h3 className="text-lg font-semibold text-neutral-700 mb-2">
          Unit Description
        </h3>
        <p className="text-neutral-600">{unit.description}</p>
      </div>

      {/* Instructor Section */}
      <div className="bg-gray-50 p-4 rounded-lg w-full">
        <h3 className="text-lg font-semibold text-neutral-700 mb-2">
          Instructor
        </h3>
        <div className="flex items-center space-x-2">
          <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-neutral-600">
            S
          </span>
          <span className="text-neutral-600">Sahan</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;