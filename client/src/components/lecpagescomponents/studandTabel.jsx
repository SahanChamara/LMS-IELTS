import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LecSidebar from "../../pages/lecturepages/Lecsidebar";


import { getAllStudents } from "../../service/studentService";
import { enrolledStudent } from "../../service/instructorService";

const StudentTable = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {

    console.log("course id in student table page", courseId);
    

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getAllStudents();

        console.log("all student fetching on coures", response);
        
        const allStudents = response?.data || [];
        setStudents(allStudents);
        setFilteredStudents(allStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    if (filter === "enrolled") {
      filtered = students.filter((s) => s.enrolledCourse && s.enrolledCourse._id);
    } else if (filter === "notEnrolled") {
      filtered = students.filter((s) => !s.enrolledCourse);
    }
    setFilteredStudents(filtered);
  }, [filter, students]);

  const handleLogout = () => navigate("/login");
  const handleBack = () => navigate(-1);

  const handleEnroll = async (studentId) => {
    try {
      await enrolledStudent({enrolledCourse: courseId}, studentId);
      alert("Student successfully enrolled!");
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId
            ? {
                ...s,
                enrolledCourse: { _id: courseId },
              }
            : s
        )
      );
    } catch (err) {
      console.error("Error enrolling student:", err);
      alert("Failed to enroll student.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-6">Loading Students...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecSidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Student Records for Course
          </h2>
          <button
            onClick={handleBack}
            className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
            <select
              className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Students</option>
              <option value="enrolled">Enrolled Students</option>
              <option value="notEnrolled">Not Enrolled Students</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Enrolled Course</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {student.name}
                      </td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4 text-gray-600">
                        {student.enrolledCourse
                          ? student.enrolledCourse.title
                          : "Not Enrolled"}
                      </td>
                      <td className="p-4">
                        <button
                          disabled={!!student.enrolledCourse}
                          onClick={() => handleEnroll(student._id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                            student.enrolledCourse
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {student.enrolledCourse ? "Enrolled" : "Allow"}
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
    </div>
  );
};

export default StudentTable;