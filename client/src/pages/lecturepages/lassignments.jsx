import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const navigate = useNavigate();

  // Fetch instructor ID
  useEffect(() => {
    const fetchInstructorId = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
          setError("No authentication token found. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        const response = await axios.get("{{baseUrl}}auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile Response:", response.data);
        setInstructorId(response.data._id);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to fetch instructor profile. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorId();
  }, [navigate]);

  // Fetch assignments
  useEffect(() => {
    if (!instructorId) return;

    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`{{baseUrl}}instructors/${instructorId}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Assignments API Response:", response.data);

        const fetchedAssignments = Array.isArray(response.data)
          ? response.data
          : response.data.assignments || response.data.data?.assignments || [];

        setAssignments(fetchedAssignments);
        setLoading(false);
      } catch (err) {
        console.error("Assignments fetch error:", err);
        setError(err.message || "Failed to fetch assignments");
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [instructorId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6">Loading...</div>
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
                    <tr key={assignment.id || assignment._id} className="border-t border-neutral-200">
                      <td className="p-4">{assignment.title || "N/A"}</td>
                      <td className="p-4">{assignment.course || "N/A"}</td>
                      <td className="p-4">{assignment.dueDate || "N/A"}</td>
                      <td className="p-4">{assignment.submissions || 0}</td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:underline">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Create New Assignment
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Lassignments;