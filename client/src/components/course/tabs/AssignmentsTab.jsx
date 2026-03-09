// components/student/AssignmentsTab.jsx
import React, { useState, useEffect, useCallback, memo } from "react";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../../../redux/store-config/store";
import { getAllAssignmentsAPI, uploadAssignmentAPI, } from "../../../redux/features/assignmentsSlice";
import useDrivePicker from "react-google-drive-picker";
import { ExternalLink } from "lucide-react";

/**
 * AssignmentsTab (Student view)
 *
 * - Sends { student, assignment, file } to backend.
 * - If local files => FormData with `student`, `assignment`, and one or more `file` fields.
 * - If Drive links => JSON with `student`, `assignment`, `file` (string). Multiple links are joined with commas.
 */
const AssignmentsTab = memo(function AssignmentsTab() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.assignments);
  const [openPicker] = useDrivePicker();

  const [assignments, setAssignments] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(null); // assignment being uploaded to
  const [studentNameLocal, setStudentNameLocal] = useState("");
  const [comments, setComments] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // files array: Drive objects (have .url) OR File objects (instanceof File)
  const [files, setFiles] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  // parse current user id safely
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") || {};
    } catch {
      return {};
    }
  })();
  const currentUserId = currentUser._id || currentUser.id || localStorage.getItem("user") || null;
  const currentUserName = currentUser.name || localStorage.getItem("userName") || "";

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await dispatch(getAllAssignmentsAPI()).unwrap();
        const maybe = result?.data ?? result;
        const arr = Array.isArray(maybe) ? maybe : Array.isArray(maybe?.data) ? maybe.data : [];
        const normalized = arr.map((a) => ({ ...a, _id: a._id || a.id }));
        setAssignments(normalized);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };
    fetchAssignments();
  }, [dispatch]);

  // time remaining (updates every minute)
  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const map = {};
      assignments.forEach((as) => {
        if (!as || !as.dueDate) {
          map[as._id] = "No due date";
          return;
        }
        const diff = new Date(as.dueDate).getTime() - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          map[as._id] = `${days}d ${hours}h ${minutes}m remaining`;
        } else {
          const late = Math.abs(diff);
          const days = Math.floor(late / (1000 * 60 * 60 * 24));
          const hours = Math.floor((late / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((late / (1000 * 60)) % 60);
          map[as._id] = `Late by ${days}d ${hours}h ${minutes}m`;
        }
      });
      setTimeRemaining(map);
    };

    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, [assignments]);

  // Drive picker
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
        if (!data) return;
        if (data.action === "cancel") return;
        if (Array.isArray(data.docs)) {
          // docs: name, id, mimeType, url, size...
          setFiles((prev) => [...prev, ...data.docs]);
        }
      },
    });
  };

  // Browser files
  const handleBrowserFiles = (e) => {
    const sel = Array.from(e.target.files || []);
    if (!sel.length) return;
    setFiles((prev) => [...prev, ...sel]);
    e.target.value = "";
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePreviewFile = (file) => {
    if (file?.url) {
      // open drive url in new tab
      window.open(file.url, "_blank", "noopener");
      return;
    }
    // browser file preview
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  // small debounce for student name (optional)
  const debouncedSetStudentName = useCallback(
    debounce((val) => setStudentNameLocal(val), 100),
    []
  );
  useEffect(() => () => debouncedSetStudentName.cancel(), [debouncedSetStudentName]);

  // helpers
  const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

  const getAssignmentStatusColor = (status) => {
    switch (status) {
      case "Submitted On Time": return "bg-green-100 text-green-800";
      case "Submitted Late": return "bg-red-100 text-red-800";
      case "Graded": return "bg-purple-100 text-purple-800";
      case "Not Graded": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssignments = assignments
    .filter((a) => {
      if (!a) return false;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (a.title || "").toLowerCase().includes(q) || (a.description || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  // Open upload form for a selected assignment
  const openUploadFor = (assignment) => {
    setShowUploadForm(assignment);
    setFiles([]);
    setComments("");
    setStudentNameLocal(currentUserName || "");
  };

  // Submit: ensure backend gets student, assignment, file
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showUploadForm) return;

    // determine student id
    const studentId = currentUserId;
    if (!studentId) {
      alert("You must be logged in to submit an assignment.");
      return;
    }

    const assignmentId = showUploadForm._id || showUploadForm.id;
    if (!assignmentId) {
      alert("Invalid assignment selected.");
      return;
    }

    if (!files.length) {
      alert("Please attach at least one file or pick from Google Drive.");
      return;
    }

    try {
      // Determine file types
      const hasBrowserFiles = files.some((f) => f instanceof File);
      const driveFiles = files.filter((f) => !(f instanceof File) && (f.url || f.id || f.alternateLink));

      if (hasBrowserFiles) {
        // Build FormData that includes student, assignment and files appended as `file`
        const fd = new FormData();
        fd.append("student", String(studentId));
        fd.append("assignment", String(assignmentId));
        // include optional comments
        if (comments) fd.append("comments", comments);
        // append files
        files.forEach((f) => {
          if (f instanceof File) {
            // backend expects 'file' string, but typically file uploads are in req.files; append as file
            fd.append("file", f, f.name);
          }
        });

        // dispatch FormData; uploadAssignmentAPI must forward FormData without JSON stringify
        await dispatch(uploadAssignmentAPI(fd)).unwrap();
      } else {
        // Drive-only (or mixed but no browser files we treat as drive-only)
        const urls = driveFiles.map((d) => d.url || d.alternateLink || d.id).filter(Boolean);
        // Ensure we send `file` as a string (backend requires string)
        let fileField = "";
        if (urls.length === 1) fileField = urls[0];
        else fileField = urls.join(",");

        const payload = {
          student: String(studentId),
          assignment: String(assignmentId),
          file: fileField, // string (single or comma-joined)
          comments: comments || "",
        };

        await dispatch(uploadAssignmentAPI(payload)).unwrap();
      }

      // success UI
      const now = new Date();
      const isLate = showUploadForm.dueDate ? new Date(showUploadForm.dueDate) < now : false;
      setSubmissionStatus({
        isLate,
        files: files.map((f) => (f.name ? f.name : f.url ? f.url : String(f))),
        assignmentId: showUploadForm.title || assignmentId,
      });
      setShowSubmissionSuccess(true);

      // reset
      setShowUploadForm(null);
      setFiles([]);
      setComments("");
      setStudentNameLocal("");

      setTimeout(() => setShowSubmissionSuccess(false), 4000);
    } catch (err) {
      console.error("Upload failed:", err);
      // prefer server message when available
      const msg = (err?.response && (err.response.data?.message || err.response.data?.error)) || err?.message || "Upload failed";
      alert(msg);
    }
  };

  // cancel upload form
  const resetUploadForm = () => {
    setShowUploadForm(null);
    setFiles([]);
    setStudentNameLocal("");
    setComments("");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md"
            aria-label="Search assignments"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="dueDate">Due date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading assignments...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="p-6 bg-white border rounded shadow-sm text-center">
          <p className="text-gray-600">No assignments available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="bg-white border p-4 rounded shadow-sm flex flex-col md:flex-row md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                <p className="text-xs text-gray-500 mt-2">Due: {formatDateTime(assignment.dueDate)}</p>
                <p className="text-xs mt-1" style={{ color: (timeRemaining[assignment._id] || "").includes("Late") ? "#b91c1c" : "#6b7280" }}>
                  {timeRemaining[assignment._id] || "No due date"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${getAssignmentStatusColor(assignment.status || "Not Submitted")}`}>
                  {assignment.status || "Not Submitted"}
                </span>

                <button
                  type="button"
                  onClick={() => window.open(assignment.file || "/sample-assignment.pdf", "_blank")}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Download
                </button>

                <button
                  type="button"
                  onClick={() => openUploadFor(assignment)}
                  className="px-3 py-1 bg-white border rounded-md text-sm hover:bg-gray-50"
                >
                  {assignment.status && assignment.status.startsWith("Submitted") ? "Resubmit" : "Upload"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAssignment(assignment)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  View / Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload form */}
      {showUploadForm && (
        <div className="mt-6 bg-white border rounded p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Submit: {showUploadForm.title}</h3>
            <button type="button" onClick={resetUploadForm} className="text-gray-600 hover:text-gray-800">Close</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium">Your name</label>
              <input
                type="text"
                defaultValue={currentUserName || ""}
                onChange={(e) => debouncedSetStudentName(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-md w-full"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Choose files</label>
              <div className="flex items-center gap-2 mt-2">
                <button type="button" onClick={handleOpenPicker} className="px-3 py-2 border rounded-md">Pick from Google Drive</button>
                <label className="px-3 py-2 border rounded-md cursor-pointer">
                  Upload from device
                  <input type="file" multiple className="hidden" onChange={handleBrowserFiles} />
                </label>
                <div className="text-sm text-gray-600">{files.length ? `${files.length} file(s)` : "No files selected"}</div>
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => handlePreviewFile(f)} className="text-indigo-600 hover:underline text-sm">
                          {f.name || f.title || (f.url && f.url.split("/").pop())}
                        </button>
                        <div className="text-xs text-gray-500">{f.size ? `${(f.size / 1024).toFixed(1)} KB` : ""}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleRemoveFile(i)} className="text-red-600">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Comments (optional)</label>
              <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3} className="mt-1 px-3 py-2 border rounded-md w-full" placeholder="Any notes for the instructor..." />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetUploadForm} className="px-4 py-2 border rounded-md">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Submit Assignment</button>
            </div>
          </form>
        </div>
      )}

      {/* Selected assignment details modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedAssignment.title}</h3>
              <button type="button" onClick={() => setSelectedAssignment(null)} className="text-gray-600">Close</button>
            </div>

            <p className="text-sm text-gray-700 mb-3">{selectedAssignment.description}</p>
            <p className="text-xs text-gray-500">Due: {formatDateTime(selectedAssignment.dueDate)}</p>

            <div className="mt-6">
              <h4 className="font-medium">Submission info</h4>
              <p className="text-sm text-gray-600 mt-2">
                Status: <span className={`px-2 py-1 rounded ${getAssignmentStatusColor(selectedAssignment.status || "Not Submitted")}`}>{selectedAssignment.status || "Not Submitted"}</span>
              </p>
              {selectedAssignment.submittedAt && <p className="text-sm text-gray-600 mt-1">Submitted: {formatDateTime(selectedAssignment.submittedAt)}</p>}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setSelectedAssignment(null)} className="px-4 py-2 border rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* File preview */}
      {showFilePreview && previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview: {previewFile.name}</h3>
              <button type="button" onClick={() => setShowFilePreview(false)} className="text-gray-600">Close</button>
            </div>
            {previewFile.type && previewFile.type.startsWith("image/") ? (
              <img src={URL.createObjectURL(previewFile)} alt="preview" className="max-w-full mx-auto" />
            ) : (
              <div className="text-center py-16">
                <p className="text-sm text-gray-600">No built-in preview available. Click below to download.</p>
                <a href={URL.createObjectURL(previewFile)} target="_blank" rel="noreferrer" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md">Open file</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submission success toast */}
      {showSubmissionSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded shadow">
          <div className="text-sm font-medium">{submissionStatus.isLate ? "Late submission" : "Submitted successfully"}</div>
          <div className="text-xs mt-1">{(submissionStatus.files || []).join(", ")}</div>
        </div>
      )}
    </div>
  );
});

export default AssignmentsTab;
