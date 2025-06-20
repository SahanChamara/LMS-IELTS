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

const Lstudents = () => {
  const [students, setStudents] = useState([]);
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

  // Fetch students
  useEffect(() => {
    if (!instructorId) return;

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`{{baseUrl}}instructors/${instructorId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Students API Response:", response.data);

        const fetchedStudents = Array.isArray(response.data)
          ? response.data
          : response.data.students || response.data.data?.students || [];

        setStudents(fetchedStudents);
        setLoading(false);
      } catch (err) {
        console.error("Students fetch error:", err);
        setError(err.message || "Failed to fetch students");
        setLoading(false);
      }
    };
    fetchStudents();
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
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Students</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-200 text-neutral-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Grades</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-neutral-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id || student._id} className="border-t border-neutral-200">
                      <td className="p-4">{student.name || "N/A"}</td>
                      <td className="p-4">{student.email || "N/A"}</td>
                      <td className="p-4">{student.course || "N/A"}</td>
                      <td className="p-4">{student.grades || "N/A"}</td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:underline">View Profile</button>
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

export default Lstudents;