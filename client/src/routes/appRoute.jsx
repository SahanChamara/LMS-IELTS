import { Routes, Route } from "react-router-dom";

//students
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

// routes 
import ProtectedRoute from "./protectedRoute";


// lecture
import Leccorces from "../pages/lecturepages/lcourses";
import Lecdashboard from "../pages/lecturepages/lecturedashboard" 
import Lstudents from "../pages/lecturepages/lstudents" 
import Lassignments from "../pages/lecturepages/lassignments"
import Leccalander  from "../pages/lecturepages/leccalnder"
import Lecsettings from "../pages/lecturepages/lecsettings"


// Admin
import SuperAdmin from "../pages/Adminpages/admindashboard"
import SuperAdminstudentcontrol from "../pages/Adminpages/adminstudents"
import SuperAdminlecturercontrol from "../pages/Adminpages/adminlecturer"
import SuperAdminnotifications from "../pages/Adminpages/adminnotifications"



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute allowedRoles={["Student", "SuperAdmin"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/institution" element={<Institution />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Activity" element={<Goals />} />
        <Route path="/units" element={<Units />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messenger />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/tools" element={<Tool />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/unit/:id" element={<CourseDetails />} />
        <Route path="/exam-application" element={<Exam />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
        <Route path="dashboard/lecture" element={<Lecdashboard />} />
        <Route path="courses/lecture" element={<Leccorces />} />
        <Route path="assignments/lecture" element={<Lassignments />} />
        <Route path="students/lecture" element={<Lstudents />} />`
        <Route path="/calendar/lecture" element={<Leccalander />} />
        <Route path="/settings/lecture" element={<Lecsettings />} />`

      </Route>
      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
         <Route path="/dashboard/admin" element={<SuperAdmin/>} />
         <Route path="/students/admin" element={<SuperAdminstudentcontrol/>} />
         <Route path="/lectures/admin" element={<SuperAdminlecturercontrol/>} />
         <Route path="/notifications/admin"  element={<SuperAdminnotifications/>} />

        


      </Route>
    </Routes>
  );
};

export default AppRoutes;
