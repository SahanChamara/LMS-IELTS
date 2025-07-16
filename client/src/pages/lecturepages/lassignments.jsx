import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecSidebar from "./Lecsidebar";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 p-6 text-red-600">
          Something went wrong: {this.state.error?.message || "Unknown error"}
        </div>
      );
    }
    return this.props.children;
  }
}

const Lassignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const navigate = useNavigate();

  // Mock data to replace API call
  useEffect(() => {
    // Simulate fetching data with a timeout
    setTimeout(() => {
      const mockAssignments = [
        { id: 1, title: "Introduction to React", course: "CS101", dueDate: "2025-07-10", submissions: 15 },
        { id: 2, title: "JavaScript Basics", course: "CS102", dueDate: "2025-07-12", submissions: 8 },
        { id: 3, title: "CSS Layouts", course: "CS103", dueDate: "2025-07-15", submissions: 20 },
      ];
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleView = (id) => {
    navigate(`/response/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 bg-neutral-100 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 bg-neutral-100">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Assignments</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-200 text-neutral-700">
                  <th className="p-4">Assignment Title</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Submissions</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-neutral-500">
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-t border-neutral-200">
                      <td className="p-4">{assignment.title || "N/A"}</td>
                      <td className="p-4">{assignment.course || "N/A"}</td>
                      <td className="p-4">{assignment.dueDate || "N/A"}</td>
                      <td className="p-4">{assignment.submissions || 0}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleView(assignment.id)}
                          className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors"
                          aria-label={`View details for ${assignment.title}`}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Lassignments;