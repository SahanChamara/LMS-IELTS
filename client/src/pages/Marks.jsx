import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getMarksByStudentId } from "../service/marksService";

const Institution = () => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual studentId from auth context or props
        const studentId = localStorage.getItem('user'); // Example studentId from sample response
        const marksResponse = await getMarksByStudentId(studentId);
        setMarks(marksResponse.data || []);
      } catch (err) {
        setError("Failed to load academic data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="fixed top-0 left-0 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Academic Performance</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Marks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">CA Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Exam Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Total Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((course, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{course.unit?.title || 'N/A'}</td>
                    <td className="p-3 text-sm">{course.caMarks ?? 'N/A'}</td>
                    <td className="p-3 text-sm">{course.examMarks ?? 'N/A'}</td>
                    <td className="p-3 text-sm">{course.totalMarks ?? 'N/A'}</td>
                    <td className="p-3 text-sm font-semibold">{course.grade || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Institution;