import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecSidebar from "./lecsidebar";

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
  const navigate = useNavigate();

  // Simulated data fetch with mock data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Mock student data for six units
        const mockData = [
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@university.com",
            unitId: "CS101",
            lastLogin: "2025-07-03",
            status: "active",
            enrolled: true,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@university.com",
            unitId: "CS101",
            lastLogin: "2025-07-02",
            status: "inactive",
            enrolled: true,
          },
          {
            id: 3,
            name: "Alex Brown",
            email: "alex.brown@university.com",
            unitId: "CS102",
            lastLogin: "2025-07-01",
            status: "active",
            enrolled: true,
          },
          {
            id: 4,
            name: "Sarah Wilson",
            email: "sarah.wilson@university.com",
            unitId: "CS102",
            lastLogin: "2025-06-30",
            status: "active",
            enrolled: false,
          },
          {
            id: 5,
            name: "Mike Johnson",
            email: "mike.johnson@university.com",
            unitId: "CS103",
            lastLogin: "2025-07-02",
            status: "active",
            enrolled: true,
          },
          {
            id: 6,
            name: "Emily Davis",
            email: "emily.davis@university.com",
            unitId: "CS103",
            lastLogin: "2025-07-01",
            status: "inactive",
            enrolled: true,
          },
          {
            id: 7,
            name: "Chris Lee",
            email: "chris.lee@university.com",
            unitId: "CS104",
            lastLogin: "2025-07-03",
            status: "active",
            enrolled: true,
          },
          {
            id: 8,
            name: "Lisa Brown",
            email: "lisa.brown@university.com",
            unitId: "CS104",
            lastLogin: "2025-07-02",
            status: "active",
            enrolled: false,
          },
          {
            id: 9,
            name: "Tom Wilson",
            email: "tom.wilson@university.com",
            unitId: "CS105",
            lastLogin: "2025-07-01",
            status: "active",
            enrolled: true,
          },
          {
            id: 10,
            name: "Anna Taylor",
            email: "anna.taylor@university.com",
            unitId: "CS105",
            lastLogin: "2025-06-30",
            status: "inactive",
            enrolled: true,
          },
          {
            id: 11,
            name: "David Miller",
            email: "david.miller@university.com",
            unitId: "CS106",
            lastLogin: "2025-07-03",
            status: "active",
            enrolled: true,
          },
          {
            id: 12,
            name: "Sophie Clark",
            email: "sophie.clark@university.com",
            unitId: "CS106",
            lastLogin: "2025-07-02",
            status: "active",
            enrolled: true,
          },
        ];
        // Simulate API delay
        setTimeout(() => {
          setStudents(mockData);
          setLoading(false);
        }, 1000);
      } catch {
        setError("Failed to load students. Please try again.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleViewUnitRecords = (unitId) => {
    navigate(`/students/lecture/records/${unitId}`); // Updated to match AppRoutes.jsx
  };

  // Group students by unitId
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.unitId]) {
      acc[student.unitId] = [];
    }
    acc[student.unitId].push(student);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 bg-neutral-100">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
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
        <div className="flex-1 p-6 bg-neutral-100 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen">
        <LecSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(groupedStudents).map((unitId) => {
              const unitStudents = groupedStudents[unitId];
              const activeStudents = unitStudents.filter(
                (s) => s.status === "active"
              ).length;
              const enrolledStudents = unitStudents.filter(
                (s) => s.enrolled
              ).length;
              const lastLogin = unitStudents.reduce((latest, student) => {
                return !latest || student.lastLogin > latest
                  ? student.lastLogin
                  : latest;
              }, null);

              return (
                <div
                  key={unitId}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                    Unit: {unitId}
                  </h3>
                  <p className="text-neutral-600 mb-2">
                    Last Student Login: {lastLogin || "N/A"}
                  </p>
                  <p className="text-neutral-600 mb-2">
                    Enrolled Students: {enrolledStudents}
                  </p>
                  <p className="text-neutral-600 mb-4">
                    Active Students: {activeStudents}
                  </p>
                  <button
                    onClick={() => handleViewUnitRecords(unitId)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                    aria-label={`View student records for ${unitId}`}
                  >
                    View Student Records
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Lstudents;