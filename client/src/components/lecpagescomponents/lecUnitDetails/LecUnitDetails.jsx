import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Defining the LecUnitDetails component to display unit details as a full page
const LecUnitDetails = () => {
  const navigate = useNavigate(); // Initialize navigate hook for routing
  const location = useLocation(); // Get location to access passed unit data
  const { unit } = location.state || {}; // Extract unit data from location state
  const [isLoading, setIsLoading] = useState(true); // State to manage loading

  // Simulating content load with a delay
  useEffect(() => {
    if (!unit) {
      // If no unit data, redirect back to courses page
      navigate("/courses/lecture");
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loading after content is "loaded"
    }, 1000); // 1-second delay for demo; adjust as needed
    return () => clearTimeout(timer);
  }, [unit, navigate]);

  // Handle back navigation to courses page
  const handleBack = () => {
    navigate("/courses/lecture");
  };

  // If still loading or no unit data, show loading spinner
  if (isLoading || !unit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Rendering the full-page unit details layout
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Main content area */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-6">
            {/* Header with Unit Title and Back Button */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
                {unit.title} Overview
              </h2>
              <button
                onClick={handleBack}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Back to Courses
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
                Overview
              </button>
              <button className="text-neutral-500 hover:text-neutral-700 pb-2">
                Lessons
              </button>
              <button className="text-neutral-500 hover:text-neutral-700 pb-2">
                Quizzes
              </button>
              <button className="text-neutral-500 hover:text-neutral-700 pb-2">
                Discussions
              </button>
              <button className="text-neutral-500 hover:text-neutral-700 pb-2">
                Assignments
              </button>
              <button className="text-neutral-500 hover:text-neutral-700 pb-2">
                Online-Session
              </button>
            </div>

            {/* Unit Details */}
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Unit Description
                </h3>
                <p className="text-neutral-600">{unit.description}</p>
              </div>

              {/* Instructor Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecUnitDetails;