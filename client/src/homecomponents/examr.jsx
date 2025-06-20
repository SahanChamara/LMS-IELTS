const ExamResults = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-full flex flex-col">
        {/* Card Title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Academic Summary</h3>
        </div>
        
        {/* Card Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* Header with Summary Stats */}
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">
                Final GPA: <span className="text-blue-600">3.65</span>
              </p>
              <p className="text-xs text-gray-600">Very Good – A Average</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium">
                A+ Grades: <span className="text-green-600">32</span>
              </p>
              <p className="text-xs text-gray-600">Excelling in Strategy & Analytics</p>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Key Strengths</h4>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                Quantitative Skills (A+ in Business Math, Data Analysis)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                Strategic Thinking (A+ in Strategic Management)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                Research & Practical Work (A+ in Dissertation)
              </li>
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1 text-xs">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-1">⚠</span>
                Statistics & Supply Chain (Repeated, initially C)
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-1">⚠</span>
                Business Communication (Consistently B/C+)
              </li>
            </ul>
          </div>

          {/* Recent Performance */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-800">Recent Highlights</h4>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">Final Year Performance</p>
                <p className="text-xs text-gray-500">All A/A+ grades</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Outstanding
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">Upcoming Final Exams</p>
                <p className="text-xs text-gray-500">March - April 2025</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Preparing
              </span>
            </div>
          </div>

          {/* Final Assessment */}
          <div className="p-3 mt-2 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-700 text-center">
              <span className="font-medium">Overall:</span> Strong academic record with consistent improvement. Ready for advanced studies or professional roles in business strategy and analytics.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Transcript
            </button>
            <button className="flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;