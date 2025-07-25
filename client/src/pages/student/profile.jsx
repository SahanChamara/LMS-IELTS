import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Card, { CardContent } from "../../components/Card";
import { Settings } from "lucide-react";
import { getStudentById, getStudentEnrolledCourse, updateStudent } from "../../service/profileService";

// Reusable Toggle Switch
const CustomSwitch = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between">
    <p className="text-base text-gray-700">{label}</p>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-10 h-5 rounded-full bg-gray-300 checked:bg-blue-600 relative appearance-none cursor-pointer transition-all duration-300
        before:content-[''] before:absolute before:top-0.5 before:left-0.5
        before:w-4 before:h-4 before:rounded-full before:bg-white
        before:transition-all checked:before:translate-x-5"
    />
  </div>
);

const Institution = () => {
  const [student, setStudent] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch student data and enrolled course
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = localStorage.getItem("user");

        if (!studentId) {
          throw new Error("Not student id found in local storage");
        }
        console.log("Fetching data for student ID:", studentId);
        // Fetch student data
        const studentResponse = await getStudentById(studentId);
        console.log("Student Data:", studentResponse);
        if (!studentResponse.success) {
          throw new Error(studentResponse.message);
        }
        setStudent(studentResponse.data);

        // Fetch enrolled course
        const courseResponse = await getStudentEnrolledCourse(studentId);
        if (courseResponse.success) {
          setEnrolledCourse(courseResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.message);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // Handle notification preference update
  const handleNotificationChange = async (e) => {
    if (!student) return;

    const newPreferences = {
      ...student.profile.preferences,
      notifications: e.target.checked,
    };

    try {
      const response = await updateStudent(student._id, {
        profile: {
          ...student.profile,
          preferences: newPreferences,
        },
      });

      if (response.success) {
        setStudent(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  }

  if (!student) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 space-y-10">
        {/* Profile Card */}
        <Card className="flex flex-col justify-between p-6 bg-white border border-gray-200 shadow-sm min-h-[300px] relative">
          <button
            onClick={() => navigate("/settings")}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-blue-100 transition"
            aria-label="Edit Profile"
            title="Edit Profile"
          >
            <Settings size={25} />
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Overview</h3>
          </div>
          <div className="mt-auto pt-6 flex flex-col items-center gap-2">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
              {student.profile.photo ? (
                <img
                  src={student.profile.photo}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.72 5.879 1.933M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
        </Card>

        <div className="space-y-10">
          {/* Basic Information */}
          <Card title="Basic Information">
            <CardContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Full Name</p>
                  <p className="text-base text-gray-900">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-base text-gray-900">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Phone</p>
                  <p className="text-base text-gray-900">{student.profile.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                  <p className="text-base text-gray-900">{student.profile.DOB}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Country</p>
                  <p className="text-base text-gray-900">{student.profile.country}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">City</p>
                  <p className="text-base text-gray-900">{student.profile.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Course */}
          <Card title="Enrolled Course">
            <CardContent className="space-y-3 mt-2">
              <p className="text-gray-700">
                {enrolledCourse ? "Course: "+ enrolledCourse.title : "No course enrolled"}
              </p>
              {enrolledCourse && (
                <p className="text-gray-700">Description: {enrolledCourse.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Institution;