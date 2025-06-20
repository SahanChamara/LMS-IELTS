import { useState } from 'react';

const OnlineSession = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: "Introduction to React",
      date: "2023-06-15",
      time: "14:00 - 15:30",
      instructor: "prof.wasana Mythree",
      meetingLink: "https://app.zoom.us/wc",
      description: "This session will cover the basics of React components and state management."
    },
    {
      id: 2,
      title: "Advanced State Management",
      date: "2023-06-22",
      time: "14:00 - 15:30",
      instructor: "prof.wasana Mythree",
      meetingLink: "https://app.zoom.us/wc",
      description: "Learn about Redux and Context API for complex state management."
    }
  ]);

  const [newSession, setNewSession] = useState({
    title: "",
    date: "",
    time: "",
    instructor: "",
    meetingLink: "",
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSession = () => {
    if (newSession.title && newSession.date && newSession.meetingLink) {
      setSessions(prev => [...prev, {
        ...newSession,
        id: prev.length + 1
      }]);
      setNewSession({
        title: "",
        date: "",
        time: "",
        instructor: "",
        meetingLink: "",
        description: ""
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Online Sessions</h2>
      
      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{session.title}</h4>
                  <p className="text-gray-600">{session.date} | {session.time}</p>
                  <p className="text-gray-600">Instructor: {session.instructor}</p>
                </div>
                <a 
                  href={session.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Join Session
                </a>
              </div>
              <p className="mt-2 text-gray-700">{session.description}</p>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default OnlineSession;