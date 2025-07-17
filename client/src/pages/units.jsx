import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/card";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import { getAllUnitsAPI } from "../redux/features/unitsSlice";
import { motion } from "framer-motion";


const Institution = () => {
  const dispatch = useAppDispatch();
  const [enrolledUnits, setEnrolledUnits] = useState({});
  const [progressData, setProgressData] = useState({});
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const {allunits,getAllUnits, getCourseId, getUnitById } = useUnits();
  // Calculate progress metrics
  const calculateProgress = (enrolled, progress) => {
    const enrolledUnits = units.filter((unit) => enrolled[unit.unitId]);

    const total = enrolledUnits.reduce((sum, unit) => sum + unit.credits, 0);
    const completed = enrolledUnits.reduce(
      (sum, unit) => (progress[unit.unitId] === 100 ? sum + unit.credits : sum),
      0
    );
  
    let weightedProgress = 0;
    let totalPossibleWeight = 0;

    enrolledUnits.forEach((unit) => {
      weightedProgress += (progress[unit.unitId] / 100) * unit.credits;
      totalPossibleWeight += unit.credits;
    });

    const overall =
      totalPossibleWeight > 0
        ? Math.round((weightedProgress / totalPossibleWeight) * 100)
        : 0;

    setTotalCredits(total);
    setCompletedCredits(completed);
    setOverallProgress(overall);
  };

  // Fetch units and initialize progress data
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
         const response = await dispatch(getAllUnitsAPI()).unwrap();
         console.log("Unit Response ",response);
         
        let fetchedUnits = [];
        if (Array.isArray(response)) {
          //console.log(response.data._id);
          fetchedUnits = response.map((unit, index) => ({
            title: unit.title || "Untitled",
            unitId: unit._id || `unit-${index}`,
            credits: unit.credits || 0,
            image: unit.image || "default-image.jpg",
          }));
        } else if (response && response.data && Array.isArray(response.data)) {
          fetchedUnits = response.data.map((unit, index) => ({
            title: unit.title || "Untitled",
            unitId: unit._id || `unit-${index}`,
            credits: unit.credits || 0,
            image: unit.image || "default-image.jpg",
          }));
        }else {
          throw new Error("Unexpected response format");
        }

        setUnits(fetchedUnits);

        const initialProgress = {};
        const initialEnrolled = {};
        fetchedUnits.forEach((unit) => {
          initialProgress[unit.unitId] = Math.floor(Math.random() * 100);
          initialEnrolled[unit.unitId] = Math.random() > 0.3;
        });
        setProgressData(initialProgress);
        setEnrolledUnits(initialEnrolled);
        calculateProgress(initialEnrolled, initialProgress);
      } catch (err) {
        setError(err.message || "Failed to fetch units. Please try again later.");
        console.error("fetchUnits error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [dispatch]);

  const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-neutral-50 text-neutral-800 justify-center items-center">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-neutral-50 text-neutral-800 justify-center items-center">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        {/* Progress Summary Card
        <Card className="mb-6">
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Unit Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">
                  Credits Completed
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {completedCredits} / {totalCredits}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">
                  Overall Progress
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {overallProgress}%
                </p>
              </div>
            </div>
          </div>
        </Card> */}

        {/* Units Card */}
        <Card>
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="px-2">
              <h2 className="text-2xl font-semibold text-gray-900">Units</h2>
              <p className="text-sm text-gray-600">
                Your comprehensive guide to all available units.
              </p>
            </div>

            <div className="mb-2 mx-auto pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {units.map((unit, index) => (
                <motion.div
                    key={index}
                    className="rounded-2xl shadow-sm border-2 border-gray-300 bg-white/10 backdrop-blur-lg p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      {
                        <img
                          src={unit.image}
                          alt={unit.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      }
                      <h2 className="text-lg font-semibold mb-1">
                        {unit.title}
                      </h2>

                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Credits:</span>{" "}
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {unit.credits}
                        </span>
                      </p>
                    </div>

                    {/* <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progressData[unit.unitId] || 0}%</span>
                      </div>
                      <ProgressBar progress={progressData[unit.unitId] || 0} />
                    </div> */}

                    <div className="flex justify-between items-center mt-auto">
                      <Link
                        to={`/unit/${unit.unitId}`}
                        state={{ unit }}
                        className="text-sm px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                      >
                        View
                      </Link>
                    </div>
                </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Institution;
