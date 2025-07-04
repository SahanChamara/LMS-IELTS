import { Routes, Route } from "react-router-dom";

// Students
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import Dashboard from "../pages/Dashboard";
import Institution from "../pages/Institution";
import Profile from "../pages/profile";
import Goals from "../pages/goals";
import Units from "../pages/units";
import Calendar from "../pages/calendar";
import Messenger from "../pages/messages";
import Marks from "../pages/Marks";
import Tool from "../pages/Tool";
import Logout from "../pages/logout";
import Privacy from "../pages/privacy";
import Terms from "../pages/Terms";
import Accessibility from "../pages/Accessibility";
import CourseDetails from "../pages/unitDetails";
import Exam from "../pages/Exam";
import StudentFeed from "../pages/StudentFeed";
import ExamDashboard from "../pages/Exam Pages/ExamDashboard";

// Routes
import ProtectedRoute from "./protectedRoute";

// Lecture
import Leccorces from "../pages/lecturepages/lcourses";
import Lecdashboard from "../pages/lecturepages/lecturedashboard";
import Lstudents from "../pages/lecturepages/lstudents";
import Lassignments from "../pages/lecturepages/lassignments";
import Leccalander from "../pages/lecturepages/leccalnder";
import Lecsettings from "../pages/lecturepages/lecsettings";
import LecUnitDetails from "../components/lecpagescomponents/lecUnitDetails/LecUnitDetails";
import InstructorFeed from "../pages/lecturepages/InstructorFeed";
import StudentAllHistory from "../components/lecpagescomponents/lecUnitDetails/StudentAllHistory";
import StudandTabel from "../components/lecpagescomponents/studandTabel";
import Response from "../pages/lecturepages/Response";

// Admin
import SuperAdmin from "../pages/Adminpages/admindashboard";
import SuperAdminstudentcontrol from "../pages/Adminpages/adminstudents";
import SuperAdminlecturercontrol from "../pages/Adminpages/adminlecturer";
import SuperAdminnotifications from "../pages/Adminpages/adminnotifications";
import IELTSLandingPage from "../pages/landing";
import Exams from "../pages/exams";
import AdminFeed from "../pages/Adminpages/AdminFeed";

// Defining the application routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<IELTSLandingPage />} />

      {/* Protected routes for Students and SuperAdmin */}
      <Route element={<ProtectedRoute allowedRoles={["Student", "SuperAdmin"]} />}>
        <Route path="/dashboard" element={<Institution />} />
        <Route path="/register" element={<Register />} />
        <Route path="/institution" element={<Institution />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exams" element={<ExamDashboard />} />
        <Route path="/Activity" element={<Goals />} />
        <Route path="/units" element={<Units />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messenger />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/settings" element={<Tool />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/feed" element={<StudentFeed />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/unit/:id" element={<CourseDetails />} />
        <Route path="/exam-application" element={<Exam />} />
      </Route>

      {/* Protected routes for Instructors */}
      <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
        <Route path="/dashboard/lecture" element={<Lecdashboard />} />
        <Route path="/courses/lecture" element={<Leccorces />} />
        <Route path="/assignments/lecture" element={<Lassignments />} />
        <Route path="/students/lecture" element={<Lstudents />} />
        <Route path="/students/lecture/records/:unitId" element={<StudandTabel />} />
        <Route path="/calendar/lecture" element={<Leccalander />} />
        <Route path="/settings/lecture" element={<Lecsettings />} />
        <Route path="/unit/lecture/:id" element={<LecUnitDetails />} />
        <Route path="/feed/lecture" element={<InstructorFeed />} />
        <Route path="/student-history/:quizId" element={<StudentAllHistory />} />
        <Route path="/response/:id" element={<Response />} />
        
      </Route>

      {/* Protected routes for SuperAdmin */}
      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route path="/dashboard/admin" element={<SuperAdmin />} />
        <Route path="/students/admin" element={<SuperAdminstudentcontrol />} />
        <Route path="/lectures/admin" element={<SuperAdminlecturercontrol />} />
        <Route path="/notifications/admin" element={<SuperAdminnotifications />} />
        <Route path="/feed/admin" element={<AdminFeed />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;