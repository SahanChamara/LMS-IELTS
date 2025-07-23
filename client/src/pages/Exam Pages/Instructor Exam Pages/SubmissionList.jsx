import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import ReviewSubmission from "./ReviewSubmission";
import Lecsidebar from "../../lecturepages/Lecsidebar";

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Custom toast function as a replacement for useToast
  const showToast = (title, description, variant) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      variant === "destructive"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`;
    toastElement.innerHTML = `<strong>${title}</strong><br>${description}`;
    document.body.appendChild(toastElement);
    setTimeout(() => document.body.removeChild(toastElement), 3000);
  };

  const submissionsPerPage = 10;

  // Enhanced mock data
  const mockSubmissions = [
    {
      _id: "sub001",
      studentId: "std001",
      studentName: "John Smith",
      examId: "exam001",
      examTitle: "IELTS Academic Reading Test 1",
      sectionId: "sec001",
      sectionTitle: "Reading Passage 1",
      submissionDate: "2024-01-15T10:30:00Z",
      status: "submitted",
      maxScore: 40,
      timeSpent: 45,
      attempts: 1,
    },
    {
      _id: "sub002",
      studentId: "std002",
      studentName: "Emma Johnson",
      examId: "exam001",
      examTitle: "IELTS Academic Reading Test 1",
      sectionId: "sec002",
      sectionTitle: "Reading Passage 2",
      submissionDate: "2024-01-15T11:45:00Z",
      status: "graded",
      totalScore: 32,
      maxScore: 40,
      timeSpent: 50,
      attempts: 2,
    },
    {
      _id: "sub003",
      studentId: "std003",
      studentName: "Michael Brown",
      examId: "exam002",
      examTitle: "IELTS Listening Practice",
      sectionId: "sec003",
      sectionTitle: "Section 1",
      submissionDate: "2024-01-16T09:15:00Z",
      status: "reviewed",
      totalScore: 28,
      maxScore: 30,
      timeSpent: 35,
      attempts: 1,
    },
    {
      _id: "sub004",
      studentId: "std004",
      studentName: "Sarah Davis",
      examId: "exam001",
      examTitle: "IELTS Academic Reading Test 1",
      sectionId: "sec001",
      sectionTitle: "Reading Passage 1",
      submissionDate: "2024-01-16T14:20:00Z",
      status: "submitted",
      maxScore: 40,
      timeSpent: 55,
      attempts: 1,
    },
    {
      _id: "sub005",
      studentId: "std005",
      studentName: "David Wilson",
      examId: "exam003",
      examTitle: "IELTS Writing Task 1 & 2",
      sectionId: "sec004",
      sectionTitle: "Writing Task 1",
      submissionDate: "2024-01-17T16:30:00Z",
      status: "graded",
      totalScore: 18,
      maxScore: 25,
      timeSpent: 90,
      attempts: 1,
    },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, examFilter, dateFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmissions(mockSubmissions);
    } catch (error) {
      showToast(
        "Error",
        "Failed to load submissions. Please try again.",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    if (examFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.examId === examFilter
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter(
          (submission) => new Date(submission.submissionDate) >= filterDate
        );
      }
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1);
  };

  const handleReviewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleBackToList = () => {
    setSelectedSubmission(null);
    fetchSubmissions();
  };

  const handleExportData = () => {
    const csvData = filteredSubmissions.map((sub) => ({
      Student: sub.studentName,
      Exam: sub.examTitle,
      Section: sub.sectionTitle,
      Status: sub.status,
      Score: sub.totalScore
        ? `${sub.totalScore}/${sub.maxScore}`
        : "Not graded",
      "Submission Date": new Date(sub.submissionDate).toLocaleDateString(),
      "Time Spent (min)": sub.timeSpent || "N/A",
    }));

    console.log("Exporting data:", csvData);
    showToast("Export Started", "Submission data export has been initiated.");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-yellow-300 bg-yellow-50 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "graded":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-green-300 bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Graded
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-blue-300 bg-blue-50 text-blue-700">
            <Eye className="h-3 w-3 mr-1" />
            Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 text-gray-700">
            Unknown
          </span>
        );
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600 font-semibold";
    if (percentage >= 60) return "text-blue-600 font-semibold";
    if (percentage >= 40) return "text-orange-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startIndex = (currentPage - 1) * submissionsPerPage;
  const endIndex = startIndex + submissionsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);

  const uniqueExams = [
    ...new Map(
      submissions.map((s) => [s.examId, { id: s.examId, title: s.examTitle }])
    ).values(),
  ];

  if (selectedSubmission) {
    return (
      <ReviewSubmission
        submission={selectedSubmission}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Lecsidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Exam Submissions
              </h1>
              <p className="text-lg text-gray-600">
                Review and grade student submissions
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm border border-yellow-200 rounded-lg shadow-md">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                  Pending Review
                </h3>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.filter((s) => s.status === "submitted").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Needs attention</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-green-200 rounded-lg shadow-md">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Graded
                </h3>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter((s) => s.status === "graded").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Auto-graded</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-lg shadow-md">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  Reviewed
                </h3>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-blue-600">
                  {submissions.filter((s) => s.status === "reviewed").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-purple-200 rounded-lg shadow-md">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                  <User className="h-4 w-4 mr-2 text-purple-600" />
                  Total Students
                </h3>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(submissions.map((s) => s.studentId)).size}
                </p>
                <p className="text-xs text-gray-500 mt-1">Unique students</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-lg shadow-md">
              <div className="p-4 pb-2">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                  Avg Score
                </h3>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-indigo-600">
                  {submissions.filter((s) => s.totalScore).length > 0
                    ? Math.round(
                        submissions
                          .filter((s) => s.totalScore)
                          .reduce(
                            (sum, s) => sum + (s.totalScore / s.maxScore) * 100,
                            0
                          ) / submissions.filter((s) => s.totalScore).length
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Overall performance
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md mb-6">
            <div className="p-6">
              <h2 className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Advanced Filters
              </h2>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search students or exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Pending</option>
                  <option value="graded">Graded</option>
                  <option value="reviewed">Reviewed</option>
                </select>
                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                >
                  <option value="all">All Exams</option>
                  {uniqueExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 border-gray-300"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setExamFilter("all");
                    setDateFilter("all");
                  }}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Submissions Table */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="flex items-center justify-between text-lg">
                <span>Submissions ({filteredSubmissions.length})</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-blue-300 bg-blue-50 text-blue-700">
                  Page {currentPage} of {totalPages}
                </span>
              </h2>
            </div>
            <div className="p-6 pt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Student
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Exam
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Section
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Score
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Time
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSubmissions.map((submission) => (
                          <tr
                            key={submission._id}
                            className="hover:bg-gray-50/50 border-t"
                          >
                            <td className="px-4 py-2">
                              <div className="font-medium">
                                {submission.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {submission.studentId}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="font-medium">
                                {submission.examTitle}
                              </div>
                              <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium border border-gray-300 bg-gray-50 text-gray-700 mt-1">
                                ID: {submission.examId}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {submission.sectionTitle}
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm">
                                {formatDate(submission.submissionDate)}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              {getStatusBadge(submission.status)}
                            </td>
                            <td className="px-4 py-2">
                              {submission.totalScore !== undefined ? (
                                <div>
                                  <span
                                    className={getScoreColor(
                                      submission.totalScore,
                                      submission.maxScore
                                    )}
                                  >
                                    {submission.totalScore}/
                                    {submission.maxScore}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {Math.round(
                                      (submission.totalScore /
                                        submission.maxScore) *
                                        100
                                    )}
                                    %
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  Not graded
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm">
                                {submission.timeSpent || "N/A"} min
                              </div>
                              <div className="text-xs text-gray-500">
                                Attempt {submission.attempts || 1}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() =>
                                  handleReviewSubmission(submission)
                                }
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 text-sm transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredSubmissions.length)} of{" "}
                        {filteredSubmissions.length} submissions
                      </div>
                      <div className="flex space-x-2">
                        {currentPage > 1 && (
                          <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            Previous
                          </button>
                        )}
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white"
                                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                                } transition-colors`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                        {currentPage < totalPages && (
                          <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center gap-1 text-sm transition-colors"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionList;
