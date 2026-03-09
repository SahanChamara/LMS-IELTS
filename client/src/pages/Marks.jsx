// src/pages/Institution.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getMarksByStudentId } from "../service/marksService";

/**
 * Institution - Academic Performance table
 *
 * Shows columns:
 * - Unit
 * - CA Marks
 * - Date  (from createdAt)
 * - Time  (from createdAt)
 * - CA %  (calculated if totalMarks present)
 * - Grade (calculated using CA % or totalMarks fallback)
 *
 * Notes:
 * - Expects getMarksByStudentId(studentId) to return array in .data or directly.
 * - Expects localStorage.getItem("user") to contain the student id or JSON user object.
 */

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "N/A";
  }
};

const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Invalid time";
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "N/A";
  }
};

/**
 * Compute CA percentage and grade.
 *
 * Logic used here (replace if you have different rules):
 * - If totalMarks is > 0, caPercent = (caMarks / totalMarks) * 100
 * - Else if totalMarks is not available use caMarks as raw percentage if it looks like %
 * - Grade mapping (simple common scale):
 *    >= 70 -> A
 *    >= 60 -> B
 *    >= 50 -> C
 *    >= 40 -> D
 *    <  40 -> F
 */
const computeCAPercent = (caMarks, totalMarks) => {
  if (caMarks == null) return null;
  if (totalMarks && totalMarks > 0) {
    return (Number(caMarks) / Number(totalMarks)) * 100;
  }
  // fallback: if total missing but caMarks looks like percent (0-100) use it
  if (caMarks >= 0 && caMarks <= 100) return Number(caMarks);
  return null;
};

const computeGrade = (caPercent, totalMarks, examMarks, totalCombined) => {
  // prefer caPercent if present
  const pct = typeof caPercent === "number" && !isNaN(caPercent)
    ? caPercent
    : // fallback compute from totals if provided
      (totalCombined && totalCombined > 0 && typeof examMarks === "number")
        ? (Number(examMarks) / Number(totalCombined)) * 100
        : null;

  if (pct == null || isNaN(pct)) return "N/A";

  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
};

const Institution = () => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student id from localStorage:
        // localStorage.user might be a raw id string or JSON stringified user object.
        let studentId = null;
        try {
          const raw = localStorage.getItem("user");
          if (!raw) {
            studentId = null;
          } else {
            // try parse JSON, else use raw
            try {
              const parsed = JSON.parse(raw);
              // parsed could be an object or just an id string
              if (parsed && typeof parsed === "object") {
                // try common id fields
                studentId = parsed._id || parsed.id || parsed.studentId || parsed.userId || null;
              } else if (typeof parsed === "string") {
                studentId = parsed;
              } else {
                studentId = null;
              }
            } catch {
              // not JSON, assume raw is the id
              studentId = raw;
            }
          }
        } catch (e) {
          console.warn("Unable to read localStorage user:", e);
          studentId = null;
        }

        if (!studentId) {
          setError("No student id found in localStorage.");
          setMarks([]);
          return;
        }

        const resp = await getMarksByStudentId(studentId);

        // Support axios: resp.data, or service returning array directly
        const arr = resp?.data ?? resp ?? [];
        if (!Array.isArray(arr)) {
          console.warn("Unexpected marks shape, expected array:", arr);
          setMarks([]);
        } else {
          setMarks(arr);
        }
      } catch (err) {
        console.error("Failed to load marks:", err);
        setError("Failed to load academic data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="fixed top-0 left-0 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Academic Performance</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Marks</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">CA Marks</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Time</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">CA %</th>
                  <th className="p-3 text-sm font-semibold text-gray-700">Calculated Grade</th>
                </tr>
              </thead>

              <tbody>
                {marks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No marks available
                    </td>
                  </tr>
                )}

                {marks.map((m, idx) => {
                  // support different shapes: m.unit may be Object with title or a string id
                  const unitTitle = m.unit?.title || m.unit?.name || (typeof m.unit === "string" ? m.unit : "N/A");

                  // fields from your sample: caMarks, examMarks, totalMarks, createdAt
                  const caMarks = m.caMarks == null ? null : Number(m.caMarks);
                  const examMarks = m.examMarks == null ? null : Number(m.examMarks);
                  const totalMarks = m.totalMarks == null ? null : Number(m.totalMarks);

                  // compute CA %
                  const caPercent = computeCAPercent(caMarks, totalMarks);
                  // compute grade: give totalCombined as totalMarks if present, else try to use totalMarks+examMarks (not required)
                  const grade = computeGrade(caPercent, totalMarks, examMarks, totalMarks);

                  const createdAt = m.createdAt || m.createdAtAt || m.created_at || null;

                  return (
                    <tr key={m._id || idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{unitTitle}</td>

                      <td className="p-3 text-sm">{caMarks != null ? caMarks : "N/A"}</td>

                      <td className="p-3 text-sm">{formatDate(createdAt)}</td>

                      <td className="p-3 text-sm">{formatTime(createdAt)}</td>

                      <td className="p-3 text-sm">
                        {typeof caPercent === "number" && !isNaN(caPercent)
                          ? `${caPercent.toFixed(1)}%`
                          : "N/A"}
                      </td>

                      <td className="p-3 text-sm font-semibold">{grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Institution;
