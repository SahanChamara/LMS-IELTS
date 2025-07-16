import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lecsidebar from "../../../pages/lecturepages/lecsidebar"; // Import Lecsidebar
import CourseTabs from "./CourseTabs"; // Import CourseTabs component
import OverviewTab from "./OverviewTab"; // Import tab components
import LessonsTab from "./LessonsTab";
import QuizzesTab from "./QuizzesTab";
import DiscussionsTab from "./DiscussionsTab";
import AssignmentsTab from "./AssignmentsTab";
import OnlineSessionTab from "./OnlineSessionTab";

// Defining the LecUnitDetails component to display unit details as a full page
const LecUnitDetails = () => {
  const navigate = useNavigate(); // Initialize navigate hook for routing
  const location = useLocation(); // Get location to access passed unit data
  const { unit } = location.state || {}; // Extract unit data from location state
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [activeTab, setActiveTab] = useState("overview"); // State for active tab

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

  // Render the appropriate tab component based on activeTab
  const renderTabContent = () => {
    switch (activeTab.toLowerCase()) {
      case "overview":
        return <OverviewTab unit={unit} />;
      case "lessons":
        return <LessonsTab unit={unit} />;
      case "quizzes":
        return <QuizzesTab unit={unit} />;
      case "discussions":
        return <DiscussionsTab unit={unit} />;
      case "assignments":
        return <AssignmentsTab unit={unit} />;
      case "online-session":
        return <OnlineSessionTab unit={unit} />;
      default:
        return <OverviewTab unit={unit} />;
    }
  };

  // Rendering the full-page unit details layout with sidebar
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Rendering the sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 z-50">
        <Lecsidebar />
      </div>

      {/* Main content area, shifted to accommodate sidebar */}
      <div className="flex-1 ml-64 p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md w-full">
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
            <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecUnitDetails;