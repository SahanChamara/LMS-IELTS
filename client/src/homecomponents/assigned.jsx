const AssignedAssessments = () => {
  const assessments = [
    {
      title: "Capstone Project",
      date: "May 2024",
      status: "Submitted",
    },
    {
      title: "Research Paper",
      date: "April 2024",
      status: "Submitted",
    },
    {
      title: "Midterm Exam",
      date: "March 2024",
      status: "Submitted",
    },
    {
      title: "Team Presentation",
      date: "February 2024",
      status: "Submitted",
    },
  ];

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm h-full p-6">
      <h3 className="text-lg font-semibold text-gray-900">Assigned Assessments</h3>
      
      <div className="text-sm text-gray-700 mt-3 space-y-3 flex-grow">
        {assessments.map((assignment, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">
                {assignment.title}
              </p>
              <p className="text-xs text-gray-500">
                Assigned • {assignment.date}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                assignment.status === "Submitted"
                  ? "text-green-600 bg-green-50 border-green-200"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}
            >
              {assignment.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedAssessments;