import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getLastFiveUniqueUnitsByStudent } from "../service/logService"; // Adjust path as needed

const CompletedCoursesCard = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await getLastFiveUniqueUnitsByStudent();
        if (response.success && response.data) {
          setUnits(response.data);
        } else {
          setError("No units found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch units");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Units</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Units</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border-2 border-gray-300/60">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Units</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(({ unit, date }) => (
          <motion.div
            key={unit._id}
            className="bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="my-3 flex justify-center h-40 overflow-hidden rounded-md">
              <img 
                src={unit.image || "https://via.placeholder.com/300"} 
                alt={unit.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-auto space-y-3">
              <h3 className="text-md font-semibold text-gray-800 mb-3">{unit.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{unit.description || "No description available"}</p>
              <div className="flex justify-end">
                <Link
                  to={`/unit/${unit._id}`}
                  state={{ unit }}
                  className="text-sm px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                >
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCoursesCard;