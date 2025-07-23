import React from "react";
import Sidebar from "../components/Sidebar";
import { courses, academicSummary } from "../data/marks";
import { useNavigate } from "react-router-dom";

const Institution = () => {
  const navigate = useNavigate();

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
                  <th className="p-3 text-sm font-semibold text-gray-700">Course</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">CA Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Exam Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Total Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">GPA</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{course.name}</td>
                    <td className="p-3 text-sm">{course.caMarks || 'N/A'}</td>
                    <td className="p-3 text-sm">{course.examMarks || 'N/A'}</td>
                    <td className="p-3 text-sm">{course.totalMarks || 'N/A'}</td>
                    <td className="p-3 text-sm font-semibold">{course.grade || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 text-right">Current GPA</h3>
              <p className="text-2xl font-bold text-blue-600 text-right">{academicSummary.finalGPA}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Institution;