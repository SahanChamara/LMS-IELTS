import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LecSidebar from "./lecsidebar";

const Lcalendar = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState(new Date().getDate());
  const [dateStrip, setDateStrip] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  
  // Initialize events with mock data
  const [events, setEvents] = useState([
    {
      id: 1,
      type: "lecture",
      course: "cs101",
      date: "2025-06-17",
      time: "10:00",
      location: "https://meet.example.com/cs101-session1",
      description: "Introduction to Algorithms and Data Structures",
      title: "CS101: Algorithms Intro",
      instructor: "Dr. John Smith",
      unitId: "CS101-U1",
    },
    {
      id: 2,
      type: "lecture",
      course: "math201",
      date: "2025-06-18",
      time: "14:00",
      location: "https://meet.example.com/math201-session1",
      description: "Fundamentals of Linear Algebra",
      title: "Math201: Linear Algebra",
      instructor: "Prof. Jane Doe",
      unitId: "MATH201-U1",
    },
    {
      id: 3,
      type: "exam",
      course: "cs101",
      date: "2025-06-20",
      time: "09:00",
      location: "https://meet.example.com/cs101-exam",
      description: "Midterm Exam for CS101",
      title: "CS101: Midterm Exam",
      instructor: "Dr. John Smith",
      unitId: "CS101-EX1",
    },
    {
      id: 4,
      type: "lecture",
      course: "math201",
      date: "2025-06-21",
      time: "11:00",
      location: "https://meet.example.com/math201-session2",
      description: "Vector Spaces and Transformations",
      title: "Math201: Vector Spaces",
      instructor: "Prof. Jane Doe",
      unitId: "MATH201-U2",
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  const prevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear((prev) => prev - 1);
  };

  const nextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear((prev) => prev + 1);
  };

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().getDate();
    const startDay = Math.max(1, today - 3);
    const newDateStrip = Array.from(
      { length: Math.min(7, daysInMonth - startDay + 1) },
      (_, i) => startDay + i
    );
    setDateStrip(newDateStrip);
    if (!newDateStrip.includes(selected)) setSelected(newDateStrip[0]);
  }, [month, year]);

  const Section = ({ title, children }) => (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>}
      {children}
    </div>
  );

  const Card = ({ className, children }) => (
    <div className={`bg-white shadow-lg rounded-lg ${className}`}>{children}</div>
  );

  const [newSession, setNewSession] = useState({
    title: "",
    date: "",
    time: "",
    instructor: "",
    meetingLink: "",
    description: "",
    unitId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSession = () => {
    const newEvent = {
      id: Date.now(),
      type: "lecture",
      course: selectedCourse === "all" ? "General" : selectedCourse,
      date: newSession.date,
      time: newSession.time,
      location: newSession.meetingLink,
      description: newSession.description,
      title: newSession.title,
      instructor: newSession.instructor,
      unitId: newSession.unitId,
    };
    setEvents((prev) => [...prev, newEvent]);
    setNewSession({
      title: "",
      date: "",
      time: "",
      instructor: "",
      meetingLink: "",
      description: "",
      unitId: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-10">
        <LecSidebar onLogout={handleLogout} />
      </div>
      <div className="flex-1 ml-64 p-4 sm:p-6 lg:p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Calendar</h1>
        <div className="max-w-8xl mx-auto mt-6">
          <Card className="p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-12">
            <Section>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <button onClick={prevMonth} className="text-gray-600 hover:text-black transition mb-2 sm:mb-0">
                  ← Prev
                </button>
                <div className="text-center">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black mb-2">
                    {new Date(year, month).toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-lg">
                    Schedule and manage your course sessions
                  </p>
                </div>
                <button onClick={nextMonth} className="text-gray-600 hover:text-black transition mt-2 sm:mt-0">
                  Next →
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
                <select
                  className="w-full sm:w-auto p-2 border rounded text-sm sm:text-base"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  <option value="cs101">CS101</option>
                  <option value="math201">Math201</option>
                </select>
                <select
                  className="w-full sm:w-auto p-2 border rounded text-sm sm:text-base"
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="lecture">Lecture</option>
                  <option value="exam">Exam</option>
                </select>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-10">
                {dateStrip.map((d, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelected(d)}
                    className={`cursor-pointer w-12 h-12 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center border text-xs sm:text-sm shadow
                      ${d === selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"} transition duration-300`}
                  >
                    <div className="text-xs font-medium">
                      {new Date(year, month, d).toLocaleDateString("default", { weekday: "short" })}
                    </div>
                    <div className="text-base sm:text-lg font-bold">{d}</div>
                  </motion.div>
                ))}
              </div>
            </Section>

            <Section>
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Schedule New Session</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newSession.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md text-sm sm:text-base"
                        placeholder="Session Title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
                      <input
                        type="text"
                        name="unitId"
                        value={newSession.unitId}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md text-sm sm:text-base"
                        placeholder="Unit ID"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newSession.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md text-sm sm:text-base"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <div className="relative">
                        <input
                          type="time"
                          name="time"
                          value={newSession.time}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-sm sm:text-base pl-8"
                        />
                        <svg
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                      <input
                        type="text"
                        name="instructor"
                        value={newSession.instructor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md text-sm sm:text-base"
                        placeholder="Instructor Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                      <input
                        type="url"
                        name="meetingLink"
                        value={newSession.meetingLink}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md text-sm sm:text-base"
                        placeholder="https://meet.example.com/your-link"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newSession.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md text-sm sm:text-base"
                      rows="3"
                      placeholder="Session description..."
                    />
                  </div>
                  <button
                    onClick={handleAddSession}
                    className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Schedule Session
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Scheduled Sessions">
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center">No sessions scheduled yet.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Link</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events
                        .filter(
                          (event) =>
                            (eventTypeFilter === "all" || event.type === eventTypeFilter) &&
                            (selectedCourse === "all" || event.course === selectedCourse)
                        )
                        .map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.title}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.unitId}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.date}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.time}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.instructor}</td>
                            <td className="px-4 py-4 text-sm text-indigo-600 hover:text-indigo-800">
                              <a href={event.location} target="_blank" rel="noopener noreferrer">
                                {event.location}
                              </a>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">{event.description}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.course}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lcalendar;