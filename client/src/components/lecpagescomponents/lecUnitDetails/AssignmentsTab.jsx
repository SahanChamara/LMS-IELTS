// components/instructor/InstructorAssignmentsTab.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Upload, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDrivePicker from "react-google-drive-picker";
import {
  addAssignmentByInstructor,
  getAllAssignments,
  getSubmitAssByUnitId,
  updateSubmissionGrade,
} from "../../../service/assignmentsService";

/**
 * InstructorAssignmentsTab
 *
 * - Create assignments (supports browser files or Drive links)
 * - View submissions modal: shows submissions for this unit
 * - Update student grade inline
 *
 * Notes:
 * - For Drive links we send `file` as a string (single link or comma-joined links)
 * - For browser files we send FormData with "file" entries
 */
const AssignmentsTab = ({ unit }) => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [openPicker] = useDrivePicker();

  const unitId = unit?._id || unit?.id || unit?.unitId || "";

  // assignment create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const [passPercentage, setPassPercentage] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [files, setFiles] = useState([]);
  const [attachmentPreviewName, setAttachmentPreviewName] = useState("");

  // list + UI state
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });

  // submissions modal
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [modalMounted, setModalMounted] = useState(false); // controls enter/exit animation
  const [submissions, setSubmissions] = useState([]); // array of submission objects
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [updatingSubmissionIds, setUpdatingSubmissionIds] = useState({}); // { [id]: true } for loading states
  const [gradeInputs, setGradeInputs] = useState({}); // { submissionId: gradeValue }
  const [feedbackInputs, setFeedbackInputs] = useState({}); // { submissionId: feedbackValue }

  // fetch assignments for unit
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllAssignments();
        const maybe = res?.data ?? res;
        const arr = Array.isArray(maybe) ? maybe : Array.isArray(maybe?.data) ? maybe.data : [];
        const filtered = arr.filter((a) => {
          const aUnitId = (a.unit && (a.unit._id || a.unit.id)) || a.unit || a.unitId;
          return String(aUnitId) === String(unitId);
        });
        filtered.sort((a, b) => {
          const da = a.dueDate ? new Date(a.dueDate) : new Date(a.createdAt || 0);
          const db = b.dueDate ? new Date(b.dueDate) : new Date(b.createdAt || 0);
          return da - db;
        });
        setAssignments(filtered);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
        setError("Failed to fetch assignments. See console.");
      } finally {
        setLoading(false);
      }
    };

    if (unitId) fetch();
    else setAssignments([]);
  }, [unitId]);

  // toast auto-hide
  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 3500);
    return () => clearTimeout(t);
  }, [toast.visible]);

  const showToast = (message, type = "info") => setToast({ visible: true, message, type });

  // Browser file input handler
  const onBrowserFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setAttachmentPreviewName(selected[0]?.name || "");
    e.target.value = "";
  };

  const onFileRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Drive picker
  const handleOpenPicker = useCallback(() => {
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
        if (Array.isArray(data.docs) && data.docs.length) {
          setFiles((prev) => [...prev, ...data.docs]);
          if (data.docs[0]?.name) setAttachmentPreviewName(data.docs[0].name);
        }
      },
    });
  }, [openPicker]);

  const validate = () => {
    if (!title.trim()) {
      showToast("Title is required", "error");
      return false;
    }
    if (!unitId) {
      showToast("Missing unit id", "error");
      return false;
    }
    if (passPercentage === "" || Number.isNaN(Number(passPercentage))) {
      showToast("passPercentage is required and must be a number", "error");
      return false;
    }
    if (totalMarks === "" || Number.isNaN(Number(totalMarks))) {
      showToast("totalMarks is required and must be a number", "error");
      return false;
    }
    if (files.length === 0) {
      showToast("Please attach a file or pick from Google Drive (backend requires file)", "error");
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPoints("");
    setFiles([]);
    setAttachmentPreviewName("");
    setPassPercentage("");
    setTotalMarks("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreateAssignment = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);

    try {
      const hasBrowserFiles = files.some((f) => f instanceof File);
      const driveFiles = files.filter((f) => !(f instanceof File) && (f.url || f.id || f.alternateLink));

      if (hasBrowserFiles) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        if (dueDate) fd.append("dueDate", dueDate);
        if (points) fd.append("points", String(points));
        fd.append("unit", unitId);
        fd.append("passPercentage", String(passPercentage));
        fd.append("totalMarks", String(totalMarks));
        files.forEach((f) => {
          if (f instanceof File) fd.append("file", f, f.name);
        });

        const res = await addAssignmentByInstructor(fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const created = res?.data ?? res;
        setAssignments((prev) => [...prev, created]);
        showToast("Assignment created and files uploaded", "success");
      } else if (driveFiles.length > 0) {
        const attachmentUrls = driveFiles.map((d) => d.url || d.alternateLink || d.id);
        const fileFieldValue = attachmentUrls.length === 1 ? attachmentUrls[0] : attachmentUrls.join(",");
        const payload = {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
          points: points ? Number(points) : null,
          unit: unitId,
          passPercentage: Number(passPercentage),
          totalMarks: Number(totalMarks),
          file: fileFieldValue,
        };

        const res = await addAssignmentByInstructor(payload);
        const created = res?.data ?? res;
        setAssignments((prev) => [...prev, created]);
        showToast("Assignment created (Drive links saved)", "success");
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
          points: points ? Number(points) : null,
          unit: unitId,
          passPercentage: Number(passPercentage),
          totalMarks: Number(totalMarks),
        };
        const res = await addAssignmentByInstructor(payload);
        const created = res?.data ?? res;
        setAssignments((prev) => [...prev, created]);
        showToast("Assignment created", "success");
      }

      clearForm();
    } catch (err) {
      console.error("Create assignment failed:", err);
      const msg = (err?.response && (err.response.data?.message || err.response.data?.error)) || err?.message || "Failed to create assignment";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Submissions modal logic =====
  // open modal and fetch submissions; also trigger enter animation and lock scroll
  const openSubmissionsModal = async () => {
    setShowSubmissionsModal(true);
    // small delay to let DOM mount before animate
    requestAnimationFrame(() => setModalMounted(true));
    await fetchSubmissions();
  };

  const closeSubmissionsModal = () => {
    // trigger exit animation
    setModalMounted(false);
    // wait for animation duration to finish (match CSS duration below: 300ms)
    setTimeout(() => {
      setShowSubmissionsModal(false);
      setSubmissions([]);
      setGradeInputs({});
      setFeedbackInputs({});
    }, 320);
  };

  // lock body scroll while modal open
  useEffect(() => {
    if (showSubmissionsModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showSubmissionsModal]);

  const fetchSubmissions = async () => {
    if (!unitId) return;
    setLoadingSubmissions(true);
    try {
      // service should return submissions for a unit — implement server endpoint getSubmissionsByUnit(unitId)
      const res = await getSubmitAssByUnitId(unitId);
      const data = res?.data ?? res;
      const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      // populate gradeInputs/feedbackInputs for editing
      const gradeMap = {};
      const fbMap = {};
      arr.forEach((s) => {
        const id = s._id || s.id;
        gradeMap[id] = s.grade ?? "";
        fbMap[id] = s.instructorFeedback ?? s.feedback ?? "";
      });
      setSubmissions(arr);
      setGradeInputs(gradeMap);
      setFeedbackInputs(fbMap);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      showToast("Failed to load submissions", "error");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeChange = (submissionId, value) => {
    setGradeInputs((prev) => ({ ...prev, [submissionId]: value }));
  };
  const handleFeedbackChange = (submissionId, value) => {
    setFeedbackInputs((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleUpdateGrade = async (submission) => {
    const id = submission._id || submission.id;
    const newGrade = gradeInputs[id];
    const newFeedback = feedbackInputs[id];

    if (newGrade === undefined || newGrade === null || newGrade === "") {
      showToast("Please enter a grade before updating", "error");
      return;
    }

    setUpdatingSubmissionIds((s) => ({ ...s, [id]: true }));

    try {
      // payload shape depends on your backend; I'm using { grade, feedback }
      const payload = { grade: newGrade, feedback: newFeedback };
      const res = await updateSubmissionGrade(id, payload);
      const updated = res?.data ?? res;

      // update local copy (merge returned updated doc if present)
      setSubmissions((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, ...updated } : p)));
      showToast("Grade updated", "success");
    } catch (err) {
      console.error("Failed to update grade:", err);
      const msg = (err?.response && (err.response.data?.message || err.response.data?.error)) || err?.message || "Update failed";
      showToast(msg, "error");
    } finally {
      setUpdatingSubmissionIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  // helper to render download links — file field could be comma joined string or a plain URL
  const renderFileLinks = (fileField) => {
    if (!fileField) return <span className="text-sm text-gray-500">No file</span>;
    if (Array.isArray(fileField)) {
      return fileField.map((f, i) => (
        <div key={i}>
          <a href={f} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">{f}</a>
        </div>
      ));
    }
    const joined = String(fileField);
    const parts = joined.includes(",") ? joined.split(",").map((p) => p.trim()).filter(Boolean) : [joined];
    return parts.map((p, i) => (
      <div key={i}>
        <a href={p} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm break-all">{p}</a>
      </div>
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments — {unit?.title || unit?.name || "Unit"}</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage assignments for this unit.</p>
          </div>

          <div>
            <button
              onClick={() => openSubmissionsModal()}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              View Submissions (Unit)
            </button>
          </div>
        </header>

        {/* Create form */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create new assignment</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="mt-1 block w-full rounded-md border-gray-300 p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe deliverables..." className="mt-1 block w-full rounded-md border-gray-300 p-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Due date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <input type="number" min="0" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g., 100" className="mt-1 block w-full rounded-md border-gray-300 p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pass % *</label>
                <input type="number" min="0" max="100" value={passPercentage} onChange={(e) => setPassPercentage(e.target.value)} placeholder="e.g., 50" className="mt-1 block w-full rounded-md border-gray-300 p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Marks *</label>
                <input type="number" min="0" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g., 100" className="mt-1 block w-full rounded-md border-gray-300 p-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Attachment (required)</label>
              <div className="flex items-center gap-3 mt-1">
                <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" aria-label="Attach file">
                  <Upload size={16} /> Attach file
                </button>

                <input ref={fileRef} type="file" className="hidden" onChange={onBrowserFileChange} multiple />

                <button type="button" onClick={handleOpenPicker} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50">
                  Pick from Google Drive
                </button>

                <div className="text-sm text-gray-600">{attachmentPreviewName || (files.length ? `${files.length} file(s)` : "No files selected")}</div>
              </div>

              <p className="text-xs text-gray-400 mt-1">Attach PDF/doc or select Drive links. Drive links are saved as a single string in `file`.</p>

              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-700">{f.name || f.title || f.url || f.id}</div>
                        <div className="text-xs text-gray-500">{f.size ? `${(f.size / 1024).toFixed(1)} KB` : ""}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {f.url && (
                          <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm inline-flex items-center gap-1">
                            View <ExternalLink size={12} />
                          </a>
                        )}
                        <button type="button" onClick={() => onFileRemove(i)} className="text-red-600">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={clearForm} type="button" className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300" disabled={submitting}>Reset</button>
              <button onClick={handleCreateAssignment} type="button" className={`px-4 py-2 rounded-md text-white ${submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`} disabled={submitting}>
                {submitting ? "Submitting..." : "Create Assignment"}
              </button>
            </div>
          </div>
        </section>

        {/* Existing assignments list */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Assignments for this unit</h2>
            <div className="text-sm text-gray-600">{loading ? "Loading..." : `${assignments.length} assignment(s)`}</div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          {assignments.length === 0 && !loading ? (
            <p className="text-gray-600">No assignments created for this unit yet.</p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((a) => {
                const id = a._id || a.id;
                return (
                  <li key={id} className="border rounded-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-md font-semibold">{a.title}</h3>
                        <span className="text-xs text-gray-500">{a.points ? `${a.points} pts` : ""}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{a.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : "No due date"} • Created: {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
                      </div>
                      {a.attachment && (
                        <div className="mt-2">
                          <a href={a.attachment} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                            View attachment <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => openSubmissionsModal()} className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">View Submissions</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Submissions modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4" aria-modal="true" role="dialog">
          {/* overlay: semi opaque + blur; animate opacity */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${modalMounted ? "opacity-80 backdrop-blur-sm" : "opacity-0"}`}
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={closeSubmissionsModal}
            aria-hidden="true"
          />

          {/* modal panel: slide + fade animation */}
          <div
            className={`relative bg-white rounded-lg w-full max-w-5xl p-6 shadow-lg z-50 max-h-[80vh] overflow-auto transform transition-all duration-300
              ${modalMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
            role="document"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Submissions — Unit: {unit?.title || unit?.name || unitId}</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={fetchSubmissions}>Refresh</button>
                <button className="px-3 py-1 bg-red-100 rounded" onClick={closeSubmissionsModal}>Close</button>
              </div>
            </div>

            {loadingSubmissions ? (
              <div className="py-10 text-center text-sm text-gray-600">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-sm text-gray-600">No submissions yet for this unit.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 text-xs font-medium text-gray-600 border-b">Student</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-600 border-b">Assignment</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-600 border-b">Submitted File(s)</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-600 border-b">Grade</th>
                      <th className="text-left p-2 text-xs font-medium text-gray-600 border-b">Instructor Feedback</th>
                      <th className="p-2 text-xs font-medium text-gray-600 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => {
                      const id = s._id || s.id;
                      const studentName = (s.student && (s.student.name || s.student.fullName)) || s.studentName || s.student || "Student";
                      const assignmentTitle = (s.assignment && (s.assignment.title || s.assignment.name)) || s.assignmentName || s.assignment || "Assignment";
                      return (
                        <tr key={id} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 align-top text-sm border-b">{studentName}</td>
                          <td className="p-2 align-top text-sm border-b">{assignmentTitle}</td>
                          <td className="p-2 align-top text-sm border-b">{renderFileLinks(s.file)}</td>
                          <td className="p-2 align-top text-sm border-b">
                            <input
                              value={gradeInputs[id] ?? ""}
                              onChange={(e) => handleGradeChange(id, e.target.value)}
                              className="px-2 py-1 border rounded w-24"
                              placeholder="e.g., 85"
                            />
                          </td>
                          <td className="p-2 align-top text-sm border-b">
                            <textarea
                              value={feedbackInputs[id] ?? ""}
                              onChange={(e) => handleFeedbackChange(id, e.target.value)}
                              className="w-full px-2 py-1 border rounded"
                              rows={2}
                              placeholder="Optional feedback"
                            />
                          </td>
                          <td className="p-2 align-top text-sm border-b">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleUpdateGrade(s)}
                                disabled={!!updatingSubmissionIds[id]}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                {updatingSubmissionIds[id] ? "Updating..." : "Update Grade"}
                              </button>
                              <a href={Array.isArray(s.file) ? s.file[0] : String(s.file).split(",")[0]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                                Download
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* toast */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 p-3 rounded-md shadow-md ${toast.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

AssignmentsTab.propTypes = {
  unit: PropTypes.object.isRequired,
};

export default AssignmentsTab;