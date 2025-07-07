import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LecSidebar from "./Lecsidebar";

const Response = () => {
  const { id } = useParams(); // Get the assignment ID from the URL
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // Mock data for student responses based on assignment ID
  useEffect(() => {
    setTimeout(() => {
      const mockResponses = [
        { id: 1, studentId: "STD001", name: "Student 1", response: "Completed with good effort.", submittedAt: "2025-07-03 14:00" },
        { id: 2, studentId: "STD002", name: "Student 2", response: "Needs improvement in structure.", submittedAt: "2025-07-03 15:30" },
        { id: 3, studentId: "STD003", name: "Student 3", response: "Excellent work!", submittedAt: "2025-07-03 16:00" },
      ].filter(response => response.id <= 3 && response.id === parseInt(id));
      setResponses(mockResponses);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGrade = (studentId) => {
    navigate(`/lecturer/assignments/${id}/grade/${studentId}`);
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
    <div className="flex min-h-screen">
      <LecSidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 bg-neutral-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Responses for Assignment {id}</h2>
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-green-200 transition-colors"
            aria-label="Go back to assignments"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-200 text-neutral-700">
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Response</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-neutral-500">
                    No responses found for this assignment
                  </td>
                </tr>
              ) : (
                responses.map((response) => (
                  <tr key={response.id} className="border-t border-neutral-200">
                    <td className="p-4">{response.studentId}</td>
                    <td className="p-4">{response.name}</td>
                    <td className="p-4">{response.response}</td>
                    <td className="p-4">{response.submittedAt}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleGrade(response.studentId)}
                        className="text-blue-600 hover:underline"
                      >
                        Give Grade
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
  );
};

export default Response;