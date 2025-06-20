import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/Card";

// Reusable Toggle Switch
const CustomSwitch = ({ defaultChecked = false }) => (
  <input
    type="checkbox"
    defaultChecked={defaultChecked}
    className="w-10 h-5 rounded-full bg-gray-300 checked:bg-blue-600 relative appearance-none cursor-pointer transition-all duration-300
      before:content-[''] before:absolute before:top-0.5 before:left-0.5
      before:w-4 before:h-4 before:rounded-full before:bg-white
      before:transition-all checked:before:translate-x-5"
  />
);

const Institution = () => {
  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      {/* Sidebar */}
     
        <Sidebar />
     

      {/* Main Content */}
      <main className=" flex-1 h-full overflow-y-auto p-6 pt-10 space-y-10">
        {/* Profile Card */}
        <Card className="flex flex-col justify-between p-6 bg-white border border-gray-200 shadow-sm min-h-[300px]">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Profile Overview
            </h3>
            <p className="text-sm text-gray-600">
              Welcome back to your dashboard!
            </p>
          </div>

          <div className="mt-auto pt-6 flex flex-col items-center gap-2">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg">
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
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Narayanan Prabharan
            </h2>
            <p className="text-sm text-gray-600">2422367</p>
          </div>
        </Card>

        {/* Info Sections */}
        <div className="space-y-10">
          {/* Basic Info */}
          <Card title="Basic Information">
            <CardContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Full Name
                  </p>
                  <p className="text-base text-gray-900">Narayanan Prabharan</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-base text-gray-900">
                    narayanan@example.com
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Student ID
                  </p>
                  <p className="text-base text-gray-900">20251234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card title="Privacy Settings">
            <CardContent className="flex items-center justify-between">
              <p className="text-base text-gray-700">
                Only instructors can view my profile information
              </p>
              <CustomSwitch defaultChecked />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card title="Global Notification Settings">
            <CardContent className="space-y-4">
              {[
                ["Stream Notifications", true],
                ["Email Notifications", false],
                ["Push Notifications", true],
              ].map(([label, checked], i) => (
                <div className="flex items-center justify-between" key={i}>
                  <p className="text-base text-gray-700">{label}</p>
                  <CustomSwitch defaultChecked={checked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* New Additional Cards */}

        <Card title="Degree Information">
          <CardContent className="space-y-3 mt-4">
            <p className="text-gray-700">Bachelor of Science in Computer Science</p>
            <p className="text-gray-700">Graduation Year: 2024</p>
            <p className="text-gray-700">Status: Active</p>
          </CardContent>
        </Card>

        <Card title="Faculty Details">
          <CardContent className="space-y-3 mt-4">
            <p className="text-gray-700">Faculty of Engineering</p>
            <p className="text-gray-700">Department: Computer Science</p>
            <p className="text-gray-700">Advisor: Dr. Jane Doe</p>
          </CardContent>
        </Card>

        <Card title="Important Information">
          <CardContent className="space-y-3 mt-4">
            <p className="text-gray-700">Next Exam Date: June 15, 2025</p>
            <p className="text-gray-700">Library Membership: Active</p>
            <p className="text-gray-700">Scholarship: Yes (50% tuition)</p>
          </CardContent>
        </Card>

        <Card title="LMS Profile Details">
          <CardContent className="space-y-3 mt-4">
            <p className="text-gray-700">LMS Username: nprabharan</p>
            <p className="text-gray-700">Courses Enrolled: 5</p>
            <p className="text-gray-700">Last Login: May 20, 2025</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Institution;
