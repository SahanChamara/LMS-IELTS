import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecSidebar from "./lecsidebar";
import { getAllCourses } from "../../service/instructorService";


const Lstudents = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses(); // Fetch from service

        console.log("all courses", response.data);
        

        setCourses(response?.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => navigate("/login");

  const handleViewCourse = (courseId) => {
    console.log("course id",courseId);
    
    navigate(`/students/lecture/records/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 bg-neutral-100">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
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
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">All Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">
                Instructor: <span className="font-medium">{course.instructor?.name}</span>
              </p>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {course.description}
              </p>
              <button
                onClick={() => handleViewCourse(course._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Students
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lstudents;