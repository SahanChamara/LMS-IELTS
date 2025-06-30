import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionsByUnitId, createSession } from '../../../service/onlineSessionService';

const OnlineSession = ({ unitId: propUnitId }) => {
  const { unitId: paramUnitId } = useParams();
  const unitId = propUnitId || paramUnitId; // Fallback to URL param
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: '',
    unit: unitId || '',
    instructor: '', // Set by auth or dropdown
    link: '',
    date: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getSessionsByUnitId(unitId);
        setSessions(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [unitId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newSession.title || !newSession.date || !newSession.link || !newSession.instructor) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const sessionData = {
        title: newSession.title,
        unit: unitId,
        instructor: newSession.instructor,
        link: newSession.link,
        date: new Date(newSession.date).toISOString(),
        description: newSession.description,
      };
      const createdSession = await createSession(sessionData);
      setSessions((prev) => [...prev, createdSession]);
      setNewSession({
        title: '',
        unit: unitId || '',
        instructor: user.role === 'Instructor' ? user._id : '',
        link: '',
        date: '',
        description: '',
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Online Sessions</h2>

      {/* Error Message */}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      {/* Loading State */}
      {loading && <div className="text-gray-600 mb-4">Loading...</div>}

      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
        {sessions.length === 0 && !loading && (
          <p className="text-gray-600">No sessions available.</p>
        )}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{session.title}</h4>
                  <p className="text-gray-600">
                    {session.date} | {session.time}
                  </p>
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