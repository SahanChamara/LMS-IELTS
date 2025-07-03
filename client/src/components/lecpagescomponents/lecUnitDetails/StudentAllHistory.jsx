import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../pages/lecturepages/lecsidebar";
import { Search, Check, X, Download } from "lucide-react";

const StudentAllHistory = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [studentHistory, setStudentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const studentsPerPage = 5;

  // Static quiz data (mocked for the specific quizId)

  // Static student history data (no duplicates)
  const staticHistory = [
    {
      id: "1",
      studentName: "John Doe",
      score: 85,
      submittedAt: null,
      attendTime: "2025-07-01 14:00",
      responsesCount: 10,
      status: "Failed",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      score: 65,
      submittedAt: null,
      attendTime: "2025-07-02 14:45",
      responsesCount: 8,
      status: "not pass score",
    },
    {
      id: "3",
      studentName: "Alice Johnson",
      score: 90,
      submittedAt: "2025-07-01 13:45",
      attendTime: "2025-07-01 13:30",
      responsesCount: 12,
      status: "not pass score",
    },
    {
      id: "4",
      studentName: "Bob Brown",
      score: 70,
      submittedAt: null,
      attendTime: "2025-07-03 10:00",
      responsesCount: 9,
      status: "not pass score",
    },
    {
      id: "5",
      studentName: "Emma Davis",
      score: 80,
      submittedAt: "2025-07-03 11:30",
      attendTime: "2025-07-03 11:00",
      responsesCount: 11,
      status: "Passed",
    },
  ];

  // Initialize student history
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setStudentHistory(staticHistory);
      setIsLoading(false);
    }, 1000);
  }, [quizId]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedHistory = [...studentHistory].sort((a, b) => {
      const aValue = a[key] ?? (key === "submittedAt" || key === "status" ? "" : -1);
      const bValue = b[key] ?? (key === "submittedAt" || key === "status" ? "" : -1);
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setStudentHistory(sortedHistory);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredHistory = staticHistory.filter((student) =>
      student.studentName.toLowerCase().includes(term)
    );
    setStudentHistory(filteredHistory);
    setCurrentPage(1);
  };

  // Handle individual send action
  const handleSend = (studentId) => {
    setIsLoading(true);
    try {
      const updatedHistory = studentHistory.map((student) => {
        if (student.id === studentId && !student.submittedAt) {
          const now = new Date();
          const istOffset = 5.5 * 60 * 60 * 1000; // IST +05:30
          const istTime = new Date(now.getTime() + istOffset);
          const formattedTime = istTime.toISOString().slice(0, 16).replace("T", " ");
          return {
            ...student,
            submittedAt: formattedTime,
          };
        }
        return student;
      });
      setStudentHistory(updatedHistory);
      setToast({
        message: `Quiz sent for student ID ${studentId}`,
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error sending quiz:", error.message);
      setToast({
        message: `Error sending quiz: ${error.message}`,
        type: "error",
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send all action
  const handleSendAll = () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST +05:30
      const istTime = new Date(now.getTime() + istOffset);
      const formattedTime = istTime.toISOString().slice(0, 16).replace("T", " ");
      
      const updatedHistory = studentHistory.map((student) => {
        if (!student.submittedAt) {
          return {
            ...student,
            submittedAt: formattedTime,
          };
        }
        return student;
      });
      setStudentHistory(updatedHistory);
      setToast({
        message: "All unsubmitted quizzes sent to student panel",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error sending all quizzes:", error.message);
      setToast({
        message: `Error sending all quizzes: ${error.message}`,
        type: "error",
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download PDF
  const handleDownloadResult = () => {
    setIsLoading(true);
    try {
      // LaTeX content for PDF
      const latexContent = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{booktabs}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{noto}

\\begin{document}

\\begin{center}
    \\textbf{\\large Student Log for Quiz ${quizId}} \\\\
    \\vspace{0.5cm}
    Generated on July 3, 2025, 21:54 IST
\\end{center}

\\vspace{0.5cm}

\\begin{tabular}{llrrll}
    \\toprule
    \\textbf{Student Name} & \\textbf{Attend Time} & \\textbf{Submitted Time} & \\textbf{Answered Questions} & \\textbf{Score} & \\textbf{Status} \\\\
    \\midrule
${studentHistory
  .map(
    (student) => `
    ${student.studentName.replace("&", "\\&")} & 
    ${student.attendTime} & 
    ${student.submittedAt || "Not Submitted"} & 
    ${student.responsesCount} & 
    ${student.score} & 
    ${student.status.replace("&", "\\&")} \\\\
`
  )
  .join("")}
    \\bottomrule
\\end{tabular}

\\end{document}
`;

      // Log LaTeX content (simulating PDF generation)
      console.log("LaTeX Content:\n", latexContent);

      // Simulate PDF creation (in a real app, this would be compiled server-side)
      const blob = new Blob([latexContent], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `quiz_${quizId}_results.tex`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToast({
        message: "PDF results downloaded successfully",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error.message);
      setToast({
        message: `Error downloading PDF: ${error.message}`,
        type: "error",
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-8xl bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-neutral-900">
              Student Log for Quiz {quizId}
            </h3>
            <button
              onClick={() => navigate("/unit/lecture/:id")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              aria-label="Back to Quizzes"
            >
              Back to Main
            </button>
          </div>

          {toast.visible && (
            <div
              role="alert"
              aria-live="polite"
              className={`fixed bottom-12 right-4 p-4 rounded-lg shadow-lg ${
                toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-600"
              } animate-fade-in-out`}
            >
              {toast.message}
            </div>
          )}

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by student name..."
                className="pl-10 pr-4 py-2 w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-neutral-900 placeholder-neutral-400"
                aria-label="Search student history"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {isLoading ? (
            <p className="text-neutral-600 text-sm text-center">Loading student history...</p>
          ) : studentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("studentName")}
                      aria-label="Sort by student name"
                    >
                      Student Name {sortConfig.key === "studentName" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("attendTime")}
                      aria-label="Sort by attend time"
                    >
                      Attend Time {sortConfig.key === "attendTime" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("submittedAt")}
                      aria-label="Sort by submission time"
                    >
                      Submitted Time {sortConfig.key === "submittedAt" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("responsesCount")}
                      aria-label="Sort by responses count"
                    >
                      Answered Question Count {sortConfig.key === "responsesCount" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("score")}
                      aria-label="Sort by score"
                    >
                      Score {sortConfig.key === "score" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th
                      className="py-4 px-4 text-center text-sm font-medium text-neutral-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("status")}
                      aria-label="Sort by status"
                    >
                      Status {sortConfig.key === "status" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                    </th>
                    <th className="py-4 px-4 text-center text-sm font-medium text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentHistory
                    .slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage)
                    .map((student) => (
                      <tr
                        key={student.id}
                        className="border-t bg-white shadow-sm rounded-lg mb-2 hover:shadow-md transition-all duration-200"
                      >
                        <td className="py-4 px-4 text-sm text-neutral-900 text-center">{student.studentName}</td>
                        <td className="py-4 px-4 text-sm text-neutral-600 text-center">{student.attendTime}</td>
                        <td className="py-4 px-4 text-sm text-neutral-600 text-center">
                          {student.submittedAt || "Not Submitted"}
                        </td>
                        <td className="py-4 px-4 text-sm text-neutral-600 text-center">{student.responsesCount}</td>
                        <td className="py-4 px-4 text-sm text-neutral-600 bg-gray-50 rounded text-center">{student.score}</td>
                        <td className="py-4 px-4 text-sm text-center">
                          {student.status === "Passed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition">
                              <Check className="h-4 w-4 mr-1" />
                              <span className="font-medium">Passed</span>
                            </span>
                          ) : student.status === "Failed" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition">
                              <X className="h-4 w-4 mr-1" />
                              <span className="font-medium">Failed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                              <span className="font-medium">{student.status || "N/A"}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-center">
                          <button
                            onClick={() => handleSend(student.id)}
                            disabled={student.submittedAt || isLoading}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                              student.submittedAt || isLoading
                                ? "bg-gray-300 text-neutral-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                            }`}
                            aria-label={`Send quiz for ${student.studentName}`}
                            title={student.submittedAt ? "Already Sended" : "Send Quiz"}
                          >
                            {student.submittedAt ? "sended" : "send"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-neutral-600 text-sm text-center">No student history available for this quiz.</p>
          )}

          {studentHistory.length > 0 && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleDownloadResult}
                disabled={isLoading}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-300 text-neutral-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 hover:scale-105"
                }`}
                aria-label="Download quiz results as PDF"
                title="Download PDF Results"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleSendAll}
                disabled={isLoading || studentHistory.every((student) => student.submittedAt)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLoading || studentHistory.every((student) => student.submittedAt)
                    ? "bg-gray-300 text-neutral-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                }`}
                aria-label="Send all quizzes"
                title="Send All Quizzes"
              >
                Send All
              </button>
            </div>
          )}

          {studentHistory.length > studentsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Back
              </button>
              {Array.from({ length: Math.ceil(studentHistory.length / studentsPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-neutral-700 hover:bg-gray-300"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(studentHistory.length / studentsPerPage)}
                className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAllHistory;