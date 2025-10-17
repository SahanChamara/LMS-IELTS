// components/lecturer/Lecdashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lecsidebar from "./lecsidebar";
import { FiBook, FiFileText, FiUsers } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getUnitByInstructorId } from "../../service/unitsService";
import { getAllAssignments, getAllSubmittedAssignment } from "../../service/assignmentsService";
import { getAllStudents } from "../../service/studentService";

/**
 * Lecturer Dashboard
 *
 * - Summary cards: Units, Assignments, Students
 * - Charts:
 *    - Bar chart: Average Assignment Grades per Unit
 *    - Pie chart: Assignments Distribution
 */

const COLORS = [
  "#4F46E5",
  "#06B6D4",
  "#F59E0B",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
  "#F472B6",
  "#60A5FA",
];

const Lecdashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // raw datasets
  const [units, setUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // derived data for charts
  const [gradesByUnit, setGradesByUnit] = useState([]);
  const [assignmentsByUnit, setAssignmentsByUnit] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch all data in parallel
        const [unitsRes, assignmentsRes, studentsRes, submissionsRes] =
          await Promise.all([
            getUnitByInstructorId(localStorage.getItem("user")),
            getAllAssignments(),
            getAllStudents(),
            getAllSubmittedAssignment(), // ✅ new call
          ]);

        // normalize responses
        const unitsArr = unitsRes?.data ?? unitsRes ?? [];
        const assignmentsArr = assignmentsRes?.data ?? assignmentsRes ?? [];
        const studentsArr = studentsRes?.data ?? studentsRes ?? [];
        const submissionsArr = submissionsRes?.data ?? submissionsRes ?? [];

        setUnits(Array.isArray(unitsArr) ? unitsArr : []);
        setAssignments(Array.isArray(assignmentsArr) ? assignmentsArr : []);
        setStudents(Array.isArray(studentsArr) ? studentsArr : []);
        setSubmissions(Array.isArray(submissionsArr) ? submissionsArr : []);

        // === Compute Average Grades per Unit ===
        const gradesMap = {}; // { unitId: { total: number, count: number } }

        submissionsArr.forEach((s) => {
          const unitId =
            (s.assignment &&
              (s.assignment.unit?._id || s.assignment.unit?.id)) ||
            s.unitId ||
            null;

          if (!unitId) return;

          const marks = s.totalMarks ?? 0;
          if (!gradesMap[unitId]) gradesMap[unitId] = { total: 0, count: 0 };
          gradesMap[unitId].total += marks;
          gradesMap[unitId].count += 1;
        });

        const gradesByUnitData = (Array.isArray(unitsArr) ? unitsArr : []).map(
          (u) => {
            const id = u._id || u.id;
            const avg =
              gradesMap[id]?.count > 0
                ? gradesMap[id].total / gradesMap[id].count
                : 0;
            return {
              unitId: id,
              unitTitle: u.title || u.name || u.code || `Unit ${id}`,
              averageGrade: Number(avg.toFixed(2)),
            };
          }
        );
        setGradesByUnit(gradesByUnitData);

        // === Compute Assignments per Unit (Pie Chart) ===
        const assignmentCountMap = {};
        assignmentsArr.forEach((a) => {
          const uId =
            (a.unit && (a.unit._id || a.unit.id)) ||
            a.unit ||
            a.unitId ||
            a.unitRef ||
            null;
          if (!uId) return;
          const key = String(uId);
          assignmentCountMap[key] = (assignmentCountMap[key] || 0) + 1;
        });

        const assignmentsByUnitData = (Array.isArray(unitsArr) ? unitsArr : []).map(
          (u) => {
            const id = u._id || u.id;
            return {
              unitId: id,
              unitTitle: u.title || u.name || u.code || `Unit ${id}`,
              assignments: assignmentCountMap[String(id)] || 0,
            };
          }
        );

        setAssignmentsByUnit(assignmentsByUnitData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data. See console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // totals
  const unitsCount = units.length;
  const assignmentsCount = assignments.length;
  const studentsCount = students.length;

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 md:block">
        <Lecsidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 md:ml-64">
        {/* Banner */}
        <div className="mb-6 bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-5 rounded-lg shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold">Welcome, Lecturer!</h2>
          <p className="mt-2 text-sm sm:text-base">
            Track student performance and assignment analytics at a glance.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <MetricCard icon={<FiBook />} label="Units" value={unitsCount} color="indigo" />
            <MetricCard icon={<FiFileText />} label="Assignments" value={assignmentsCount} color="sky" />
            <MetricCard icon={<FiUsers />} label="Students" value={studentsCount} color="green" />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Average Grades per Unit */}
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Average Grades per Unit</h3>
              <div className="text-xs text-gray-500">Average % by unit</div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : gradesByUnit.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No grade data</div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={gradesByUnit} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <XAxis dataKey="unitTitle" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageGrade" name="Avg Grade (%)" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie Chart - Assignments per Unit */}
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Assignments Distribution</h3>
              <div className="text-xs text-gray-500">By unit</div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
            ) : assignmentsByUnit.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500">No assignment data</div>
            ) : (
              <div style={{ width: "100%", height: 320 }} className="flex items-center justify-center">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={assignmentsByUnit}
                      dataKey="assignments"
                      nameKey="unitTitle"
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={4}
                      label={(entry) =>
                        entry.assignments > 0
                          ? `${entry.unitTitle} (${entry.assignments})`
                          : ""
                      }
                    >
                      {assignmentsByUnit.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lecdashboard;

// Reusable card
const MetricCard = ({ icon, label, value, color }) => {
  const bg = {
    indigo: "bg-indigo-50 text-indigo-600",
    sky: "bg-sky-50 text-sky-600",
    green: "bg-green-50 text-green-600",
  }[color];
  return (
    <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4 hover:shadow-lg transition">
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
      <div>
        <h4 className="text-sm text-gray-500">{label}</h4>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
};