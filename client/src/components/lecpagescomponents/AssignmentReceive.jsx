import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Loader2, ChevronDown, ChevronUp, Check, Download } from "lucide-react";
import LecSidebar from "../../pages/lecturepages/lecsidebar";

const AssignmentReceive = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Mock data matching the image
  const mockAssignments = [
    { id: 1, timestamp: "2025-07-10T17:30:00Z", studentId: "5001", studentName: "John Doe", assignmentName: "Assignment_1.pdf" },
    { id: 2, timestamp: "2025-07-11T17:30:00Z", studentId: "5002", studentName: "Jane Smith", assignmentName: "Assignment_2.pdf" },
    { id: 3, timestamp: "2025-07-12T17:30:00Z", studentId: "5003", studentName: "Alice Johnson", assignmentName: "Assignment_3.pdf" },
    { id: 4, timestamp: "2025-07-13T17:30:00Z", studentId: "5004", studentName: "Bob Wilson", assignmentName: "Assignment_4.pdf" },
    { id: 5, timestamp: "2025-07-14T17:30:00Z", studentId: "5005", studentName: "Emma Brown", assignmentName: "Assignment_5.pdf" },
    { id: 6, timestamp: "2025-07-15T17:30:00Z", studentId: "5006", studentName: "Liam Davis", assignmentName: "Assignment_6.pdf" },
    { id: 7, timestamp: "2025-07-16T17:30:00Z", studentId: "5007", studentName: "Olivia Taylor", assignmentName: "Assignment_7.pdf" },
    { id: 8, timestamp: "2025-07-17T17:30:00Z", studentId: "5008", studentName: "Noah Martinez", assignmentName: "Assignment_8.pdf" },
    { id: 9, timestamp: "2025-07-18T17:30:00Z", studentId: "5009", studentName: "Sophia Anderson", assignmentName: "Assignment_9.pdf" },
    { id: 10, timestamp: "2025-07-19T17:30:00Z", studentId: "5010", studentName: "James Thomas", assignmentName: "Assignment_10.pdf" },
  ];

  // Use state assignments if available, otherwise use mock data
  const assignments = state?.assignments?.length > 0 ? state.assignments : mockAssignments;

  // State to manage marks and saved status
  const [marks, setMarks] = useState(
    assignments.reduce((acc, assignment) => ({
      ...acc,
      [assignment.id]: "",
    }), {})
  );

  const [isLoading, setIsLoading] = useState(
    assignments.reduce((acc, assignment) => ({
      ...acc,
      [assignment.id]: false,
    }), {})
  );

  const [isSaved, setIsSaved] = useState(
    assignments.reduce((acc, assignment) => ({
      ...acc,
      [assignment.id]: false,
    }), {})
  );

  const [isSavingAll, setIsSavingAll] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Enrich assignments with status and formatted date
  const enrichedAssignments = assignments.map((assignment) => ({
    ...assignment,
    status: new Date() > new Date(assignment.timestamp) ? "Overdue" : "Submitted",
    submittedDate: new Date(assignment.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort assignments
  const sortedAssignments = React.useMemo(() => {
    let sortableItems = [...enrichedAssignments];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [enrichedAssignments, sortConfig]);

  // Handle Save Marks action
  const handleSaveMarks = (assignment) => {
    const mark = marks[assignment.id];
    if (mark !== "" && mark >= 0 && mark <= 100) {
      setIsLoading((prev) => ({ ...prev, [assignment.id]: true }));
      setTimeout(() => {
        setIsLoading((prev) => ({ ...prev, [assignment.id]: false }));
        setIsSaved((prev) => ({ ...prev, [assignment.id]: true }));
        setTimeout(() => {
          setIsSaved((prev) => ({ ...prev, [assignment.id]: false }));
        }, 2000);
      }, 1000);
    }
  };

  // Handle marks input change
  const handleMarksChange = (assignmentId, value) => {
    setMarks((prev) => ({
      ...prev,
      [assignmentId]: value,
    }));
    setIsSaved((prev) => ({ ...prev, [assignmentId]: false }));
  };

  // Handle Save All action
  const handleSaveAll = () => {
    setIsSavingAll(true);
    setTimeout(() => {
      setIsSavingAll(false);
    }, 1500);
  };

  // Styles
  const buttonBaseStyles = "w-20 h-9 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center";
  const primaryButtonStyles = `${buttonBaseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none`;
  const primaryButtonStyles2 = `${buttonBaseStyles} bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none`;
  const loadingButtonStyles = `${buttonBaseStyles} bg-gray-300 text-gray-600 cursor-not-allowed`;
  const savedButtonStyles = `${buttonBaseStyles} bg-green-600 text-white`;

  const thStyles = "px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-50";
  const tdStyles = "px-4 py-3 text-center text-sm text-gray-900";

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed h-full z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
        <LecSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 overflow-auto transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Responses</h1>
          <div className="flex gap-4">
            <button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className={isSavingAll ? loadingButtonStyles : primaryButtonStyles}
            >
              {isSavingAll ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                "Save All"
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              className={primaryButtonStyles2}
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {enrichedAssignments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No assignments received yet.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thStyles} onClick={() => requestSort('studentId')}>
                      <div className="flex items-center justify-center">
                        STUDENT ID
                        {sortConfig.key === 'studentId' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={thStyles} onClick={() => requestSort('studentName')}>
                      <div className="flex items-center justify-center">
                        STUDENT NAME
                        {sortConfig.key === 'studentName' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={thStyles} onClick={() => requestSort('assignmentName')}>
                      <div className="flex items-center justify-center">
                        ASSIGNMENT
                        {sortConfig.key === 'assignmentName' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={thStyles} onClick={() => requestSort('submittedDate')}>
                      <div className="flex items-center justify-center">
                        SUBMITTED
                        {sortConfig.key === 'submittedDate' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={thStyles} onClick={() => requestSort('status')}>
                      <div className="flex items-center justify-center">
                        STATUS
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className={thStyles}>
                      GIVE MARKS (0-100)
                    </th>
                    <th className={thStyles}>
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className={tdStyles}>
                        {assignment.studentId}
                      </td>
                      <td className={tdStyles}>
                        {assignment.studentName}
                      </td>
                      <td className={tdStyles}>
                        <div className="flex items-center justify-center">
                          <FileText size={16} className="mr-2 text-blue-600" />
                          <a
                            href="#"
                            className="text-blue-600 hover:underline flex items-center"
                            onClick={(e) => e.preventDefault()}
                          >
                            {assignment.assignmentName}
                            <Download className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className={tdStyles}>
                        {assignment.submittedDate}
                      </td>
                      <td className={tdStyles}>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.status === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td className={tdStyles}>
                        <div className="flex justify-center">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={marks[assignment.id] || ""}
                              onChange={(e) => handleMarksChange(assignment.id, e.target.value)}
                              className="w-24 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center"
                              placeholder="0-100"
                            />
                            {isSaved[assignment.id] && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Check className="h-4 w-4 text-green-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={tdStyles}>
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleSaveMarks(assignment)}
                            disabled={isLoading[assignment.id]}
                            className={
                              isLoading[assignment.id]
                                ? loadingButtonStyles
                                : isSaved[assignment.id]
                                ? savedButtonStyles
                                : primaryButtonStyles
                            }
                          >
                            <span className="flex items-center justify-center">
                              {isLoading[assignment.id] && (
                                <Loader2 className="animate-spin mr-2" size={16} />
                              )}
                              {isLoading[assignment.id]
                                ? "Saving..."
                                : isSaved[assignment.id]
                                ? "Saved!"
                                : "Save"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentReceive;