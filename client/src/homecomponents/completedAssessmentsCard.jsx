import React from 'react';

const StudentAssessmentsDashboard = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-300 shadow-sm rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessments</h2>
      
      {/* Alert Notification */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r">
        <div className="flex items-start">
          <div className="flex-shrink-0">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Reminder:</span> Your "Advanced Algorithms" project submission is due in 2 days
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Projects */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Currently Working On
        </h3>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
          <div>
            <p className="font-medium text-gray-800">Advanced Algorithms Project</p>
            <p className="text-sm text-gray-500">Due: June 15, 2023</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-1 bg-white text-blue-800 text-xs font-medium rounded-full border border-blue-200">
              ⏳ 2 days left
            </span>
          </div>
        </div>
      </div>
      
      {/* Recent Assessments */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Recently Completed
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Database Systems Exam</p>
              <p className="text-sm text-gray-500">Submitted: May 28, 2023</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                A
              </span>
              <p className="text-xs text-gray-500 mt-1">Feedback available</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Research Paper</p>
              <p className="text-sm text-gray-500">Submitted: May 15, 2023</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                A+
              </span>
              <p className="text-xs text-gray-500 mt-1">View comments</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Assessments */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Upcoming Deadlines
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Final Exam</p>
              <p className="text-sm text-gray-500">June 20, 2023 • 9:00 AM</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 bg-white text-red-800 text-xs font-medium rounded-full border border-red-200">
                ⏳ 7 days left
              </span>
              <p className="text-xs text-gray-500 mt-1">Syllabus available</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Group Project</p>
              <p className="text-sm text-gray-500">June 25, 2023 • 11:59 PM</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 bg-white text-orange-800 text-xs font-medium rounded-full border border-orange-200">
                ⏳ 12 days left
              </span>
              <p className="text-xs text-gray-500 mt-1">Team meeting tomorrow</p>
            </div>
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default StudentAssessmentsDashboard;