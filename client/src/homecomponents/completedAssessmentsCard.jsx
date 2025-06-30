import React from "react";
import { motion } from "framer-motion";

const StudentAssessmentsDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 shadow-lg rounded-xl p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Assessments</h2>
      
      {/* Alert Notification */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-yellow-50/80 backdrop-blur-sm border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 text-yellow-700 text-lg">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Reminder:</span> Your "Advanced Algorithms" project submission is due in 2 days
            </p>
          </div>
        </div>
      </motion.div>
      

      
      {/* Upcoming Assessments */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Upcoming Deadlines
        </h3>
        
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-4 bg-red-50/80 backdrop-blur-sm border-2 border-gray-300/30 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-800">Final Exam</p>
              <p className="text-sm text-gray-500">June 20, 2023 • 9:00 AM</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-white text-red-800 text-xs font-medium rounded-full border border-red-200 shadow-sm">
                ⏳ 7 days left
              </span>
              <p className="text-xs text-gray-500 mt-1">Syllabus available</p>
            </div>
          </motion.div>
          
          <div
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-4 bg-orange-50/80 backdrop-blur-sm border-2 border-gray-300/30 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-800">Group Project</p>
              <p className="text-sm text-gray-500">June 25, 2023 • 11:59 PM</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-white text-orange-800 text-xs font-medium rounded-full border border-orange-200 shadow-sm">
                ⏳ 12 days left
              </span>
              <p className="text-xs text-gray-500 mt-1">Team meeting tomorrow</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentAssessmentsDashboard;