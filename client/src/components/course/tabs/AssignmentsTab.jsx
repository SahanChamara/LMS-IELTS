import React, { useState, useEffect, useCallback, memo } from "react";
import { debounce } from "lodash"; // Install lodash: npm install lodash
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store-config/store";
import {
  getAllAssignmentsAPI,
  uploadAssignmentAPI,
} from "../../../redux/features/assignmentsSlice";
import useDrivePicker from "react-google-drive-picker";
import { Link } from "lucide-react";

const AssignmentsTab = memo(function AssignmentsTab() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.assignments);

  const [assignments, setAssignments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [comments, setComments] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({});
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [files, setFiles] = useState([]);

  // Fetch all assignments on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await dispatch(getAllAssignmentsAPI()).unwrap();
        console.log("get all assignment ", result);
        setAssignments(result || []);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };
    fetchAssignments();
  }, [dispatch]);

  console.log("Assignments:", assignments);
  console.log("Loading:", loading);
  console.log("Error:", error);

  // Calculate time remaining for each assignment
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const newTimeRemaining = {};

      assignments.forEach((assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const diff = dueDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[
            assignment._id || assignment.id
          ] = `${days}d ${hours}h ${minutes}m remaining`;
        } else {
          const lateBy = Math.abs(diff);
          const days = Math.floor(lateBy / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (lateBy % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((lateBy % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[
            assignment._id || assignment.id
          ] = `Late by ${days}d ${hours}h ${minutes}m`;
        }
      });

      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [assignments]);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Google Drive Picker
  const [openPicker] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_GOOGLE_DEVELOPER_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      customScopes: ["https://www.googleapis.com/auth/drive.file"],
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User Click Cancel");
        } else if (data.docs) {
          console.log("Google Drive Upload Data", data.docs);
          setFiles(data.docs); // Update files state only
        }
      },
    });
  };

  console.log("upload File", files);

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Debounced handler for studentName
  const debouncedSetStudentName = useCallback(
    debounce((value) => setStudentName(value), 10),
    []
  );

  const handleStudentNameChange = (e) => {
    debouncedSetStudentName(e.target.value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetStudentName.cancel();
    };
  }, [debouncedSetStudentName]);

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered"); // Debug log
    const now = new Date();
    const submittedAt = now.toISOString();

    console.log(studentName, files, comments);

    const uploadAssignment = {
      student: localStorage.getItem("user"),
      assignment: showUploadForm._id,
      file: files.length > 0 ? files[0].url : "",
      feedback: comments,
      totalMarks: showUploadForm.totalMarks,
    };

    console.log("upload assignment data", uploadAssignment);

    try {
      const result = await dispatch(uploadAssignmentAPI(uploadAssignment)).unwrap();
      console.log("uploaded Result", result);
      setShowUploadForm(null);
      setFiles([]);
      setStudentName("");
      setComments("");
      setShowSubmissionSuccess(true);
      setSubmissionStatus({
        isLate: new Date(showUploadForm.dueDate) < now,
        files: files.map((file) => file.name),
        assignmentId: showUploadForm.title,
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleGradeAssignment = (
    assignmentId,
    status,
    grade = null,
    feedback = ""
  ) => {
    const updatedAssignments = assignments.map((a) => {
      if (a._id === assignmentId || a.id === assignmentId) {
        return {
          ...a,
          status,
          grade: grade !== null ? grade : a.grade,
          feedback: feedback !== "" ? feedback : a.feedback,
        };
      }
      return a;
    });
    setAssignments(updatedAssignments);
    setSelectedAssignment(null);
    setGrade("");
    setFeedback("");
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case "Submitted On Time":
        return "bg-green-100 text-green-800";
      case "Submitted Late":
        return "bg-red-100 text-red-800";
      case "Graded":
        return "bg-purple-100 text-purple-800";
      case "Not Graded":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const getAssignmentDetails = (assignment) => {
    const details = [];
    if (assignment.subjectCode)
      details.push(`Subject: ${assignment.subjectCode}`);
    if (assignment.type) details.push(`Type: ${assignment.type}`);
    if (assignment.marks) details.push(`Marks: ${assignment.marks}`);
    if (assignment.timeLimit)
      details.push(`Time Limit: ${assignment.timeLimit} minutes`);
    if (assignment.wordCount)
      details.push(`Word Count: ${assignment.wordCount}`);
    if (assignment.teamSize) details.push(`Team Size: ${assignment.teamSize}`);
    if (assignment.language) details.push(`Language: ${assignment.language}`);
    if (assignment.citationStyle)
      details.push(`Citation: ${assignment.citationStyle}`);
    return details.join(" • ");
  };

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        filterSubject === "all" || assignment.subjectCode === filterSubject;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "submitted" &&
          (assignment.status === "Submitted On Time" ||
            assignment.status === "Submitted Late")) ||
        (filterStatus === "notSubmitted" && !assignment.status) ||
        (filterStatus === "graded" && assignment.status === "Graded");
      return matchesSearch && matchesSubject && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate")
        return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "subject")
        return a.subjectCode.localeCompare(b.subjectCode);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assignments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="subject">Subject</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {!showUploadForm && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment._id || assignment.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          assignment.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          <Link/>
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getAssignmentDetails(assignment)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">
                        Due: {formatDateTime(assignment.dueDate)}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          timeRemaining[
                            assignment._id || assignment.id
                          ]?.includes("Late")
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {timeRemaining[assignment._id || assignment.id]}
                      </p>
                      {assignment.submittedAt ? (
                        <p className="text-sm mt-1">
                          Submitted: {formatDateTime(assignment.submittedAt)}
                        </p>
                      ) : (
                        <p className="text-sm mt-1 text-gray-500">
                          Not Submitted
                        </p>
                      )}
                      {assignment.grade && (
                        <p className="text-sm mt-1 font-medium">
                          Grade: {assignment.grade}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(
                        assignment.status || "Not Submitted"
                      )}`}
                    >
                      {assignment.status || "Not Submitted"}
                    </span>
                    {assignment.isLate && assignment.status && (
                      <span className="mt-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                        Late
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
                    onClick={() =>
                      window.open("/sample-assignment.pdf", "_blank")
                    }
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>

                  <button
                    type="button" // Explicitly set type to prevent form submission
                    className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center"
                    onClick={() => setShowUploadForm(assignment)}
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {assignment.status &&
                    assignment.status.startsWith("Submitted")
                      ? "Resubmit"
                      : "Upload"}
                  </button>

                  {(assignment.status === "Submitted On Time" ||
                    assignment.status === "Submitted Late" ||
                    assignment.status === "Not Graded") && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Grade
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No assignments found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {showUploadForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Submit Assignment: {showUploadForm.title}
            </h3>
            <button
              onClick={() => {
                setShowUploadForm(null);
                setFiles([]);
                setStudentName("");
                setComments("");
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
                value={studentName}
                onChange={handleStudentNameChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Files (Multiple allowed)
              </label>
              <div className="mt-1 flex items-center">
                <button
                  type="button" // Explicitly set type to prevent form submission
                  onClick={handleOpenPicker}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Choose Files
                </button>
                <span className="ml-2 text-sm text-gray-500">
                  {files.length > 0
                    ? `${files.length} files selected`
                    : "No files chosen"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOCX, PPTX, JPG, PNG up to 10MB each
              </p>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(file)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          {file.name}
                        </button>
                        <span className="ml-2 text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any additional comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(null);
                  setFiles([]);
                  setStudentName("");
                  setComments("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!files.length || !studentName}
              >
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAssignment.title} - Submission Details
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">
                  Assignment Information
                </h4>
                <p className="text-sm text-gray-500">
                  {selectedAssignment.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getAssignmentDetails(selectedAssignment)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Due: {formatDateTime(selectedAssignment.dueDate)}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">
                  Student Information
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by:{" "}
                  {selectedAssignment.studentName || "Not available"}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted on:{" "}
                  {selectedAssignment.submittedAt
                    ? formatDateTime(selectedAssignment.submittedAt)
                    : "Not submitted"}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getAssignmentStatusColor(
                      selectedAssignment.status || "Not Submitted"
                    )}`}
                  >
                    {selectedAssignment.status || "Not Submitted"}
                  </span>
                  {selectedAssignment.isLate && (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Late Submission
                    </span>
                  )}
                </p>
              </div>

              {selectedAssignment.files &&
                selectedAssignment.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700">
                      Submitted Files
                    </h4>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <button
                            onClick={() =>
                              window.open(URL.createObjectURL(file), "_blank")
                            }
                            className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedAssignment.comments && (
                <div>
                  <h4 className="font-medium text-gray-700">
                    Student Comments
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {selectedAssignment.comments}
                  </p>
                </div>
              )}

              {(selectedAssignment.status === "Submitted On Time" ||
                selectedAssignment.status === "Submitted Late" ||
                selectedAssignment.status === "Not Graded") && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700">
                    Grade Assignment
                  </h4>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter grade (e.g., A, 95/100)"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Provide feedback to the student..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedAssignment(null)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleGradeAssignment(
                            selectedAssignment._id || selectedAssignment.id,
                            "Graded",
                            grade,
                            feedback
                          )
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={!grade}
                      >
                        Submit Grade
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedAssignment.status === "Graded" && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700">
                    Grading Information
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Grade:{" "}
                    <span className="font-medium">
                      {selectedAssignment.grade}
                    </span>
                  </p>
                  {selectedAssignment.feedback && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Feedback:
                      </h5>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                        {selectedAssignment.feedback}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        handleGradeAssignment(
                          selectedAssignment._id || selectedAssignment.id,
                          "Not Graded"
                        )
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                    >
                      Reopen for Grading
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFilePreview && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                File Preview: {previewFile.name}
              </h3>
              <button
                onClick={() => setShowFilePreview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <div className="text-center py-10">
                  <svg
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Preview not available for this file type. Download to view.
                  </p>
                  <button
                    onClick={() =>
                      window.open(URL.createObjectURL(previewFile), "_blank")
                    }
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSubmissionSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${
              submissionStatus.isLate ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  submissionStatus.isLate
                    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    : "M5 13l4 4L19 7"
                }
              />
            </svg>
            <div>
              <p className="font-medium">
                {submissionStatus.isLate
                  ? "Late Submission!"
                  : "Assignment Submitted Successfully!"}
              </p>
              <p className="text-sm">
                {submissionStatus.files?.join(", ")} has been uploaded for
                Assignment {submissionStatus.assignmentId}
              </p>
            </div>
            <button
              onClick={() => setShowSubmissionSuccess(false)}
              className="ml-4 text-green-100 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default AssignmentsTab;