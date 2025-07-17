import { Routes, Route } from 'react-router-dom'

// Students
// import Home from '../pages/Home'
// import Courses from '../pages/Courses'
// import Dashboard from '../pages/Dashboard'
import Exam from '../pages/Exam'
import Login from '../pages/student/Login'
import Register from '../pages/student/Register'
import Institution from '../pages/Institution'
import Profile from '../pages/student/profile'
import Goals from '../pages/student/goals'
import Units from '../pages/units'
import Calendar from '../pages/student/calendar'
import Messenger from '../pages/student/messages'
import Marks from '../pages/Marks'
import Tool from '../pages/student/Tool'
import Logout from '../pages/student/logout'
import Privacy from '../pages/student/privacy'
import Terms from '../pages/student/Terms'
import Accessibility from '../pages/student/Accessibility'
import CourseDetails from '../pages/student/unitDetails'
import StudentFeed from '../pages/student/StudentFeed'
import ExamDashboard from '../pages/Exam Pages/ExamDashboard'

// Routes
import ProtectedRoute from './protectedRoute'

// Lecture
import Leccorces from '../pages/lecturepages/lcourses'
import Lecdashboard from '../pages/lecturepages/lecturedashboard'
import Lstudents from '../pages/lecturepages/lstudents'
import Lassignments from '../pages/lecturepages/lassignments'
import Leccalander from '../pages/lecturepages/leccalnder'
import Lecsettings from '../pages/lecturepages/lecsettings'
import LecUnitDetails from '../components/lecpagescomponents/lecUnitDetails/LecUnitDetails'
import InstructorFeed from '../pages/lecturepages/InstructorFeed'
import StudentAllHistory from '../components/lecpagescomponents/lecUnitDetails/StudentAllHistory'
import StudandTabel from '../components/lecpagescomponents/studandTabel'
import Response from '../pages/lecturepages/Response'
import AssignmentReceive from '../components/lecpagescomponents/AssignmentReceive'

// Admin
// import Exams from '../pages/exams'
// import AdminFeed from '../pages/Adminpages/AdminFeed'
import SuperAdmin from '../pages/Adminpages/admindashboard'
import SuperAdminstudentcontrol from '../pages/Adminpages/adminstudents'
import SuperAdminlecturercontrol from '../pages/Adminpages/adminlecturer'
import SuperAdminnotifications from '../pages/Adminpages/adminnotifications'
import IELTSLandingPage from '../pages/Adminpages/landing'
import AdminFeed from '../pages/Adminpages/AdminFeed'
import InstructorDashboard from "../pages/Exam Pages/Instructor Exam Pages/InstructorDashboard";

// Defining the application routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<IELTSLandingPage />} />

      {/* Protected routes for Students and SuperAdmin */}
      <Route
        element={<ProtectedRoute allowedRoles={['Student', 'SuperAdmin']} />}
      >
        <Route path='/dashboard' element={<Institution />} />
        <Route path='/register' element={<Register />} />
        <Route path='/institution' element={<Institution />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/exams' element={<ExamDashboard />} />
        <Route path='/Activity' element={<Goals />} />
        <Route path='/units' element={<Units />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/messages' element={<Messenger />} />
        <Route path='/marks' element={<Marks />} />
        <Route path='/settings' element={<Tool />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/feed' element={<StudentFeed />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/accessibility' element={<Accessibility />} />
        <Route path='/unit/:id' element={<CourseDetails />} />
        <Route path='/exam-application' element={<Exam />} />
      </Route>

      {/* Protected routes for Instructors */}
      <Route element={<ProtectedRoute allowedRoles={['Instructor']} />}>
        <Route path='dashboard/lecture' element={<Lecdashboard />} />
        <Route path='courses/lecture' element={<Leccorces />} />
        <Route path='assignments/lecture' element={<Lassignments />} />
        <Route path='students/lecture' element={<Lstudents />} />
        <Route path='/calendar/lecture' element={<Leccalander />} />
        <Route path='/settings/lecture' element={<Lecsettings />} />
        <Route path='/unit/lecture/:id' element={<LecUnitDetails />} />
        <Route path='/feed/lecture' element={<InstructorFeed />} />
        <Route path='/student-history/:quizId' element={<StudentAllHistory />} />
        <Route path='/response/:id' element={<Response />} />
        <Route path='/students/lecture/records/:unitId' element={<StudandTabel />} />
        <Route path='/assignments/receive' element={<AssignmentReceive />} />
        <Route path="/exam/lecture" element={<InstructorDashboard />} />
      </Route>

      {/* Protected routes for SuperAdmin */}
      <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
        <Route path='/dashboard/admin' element={<SuperAdmin />} />
        <Route path='/students/admin' element={<SuperAdminstudentcontrol />} />
        <Route path='/lectures/admin' element={<SuperAdminlecturercontrol />} />

        <Route path='/feed/admin' element={<AdminFeed />} />
        <Route
          path='/notifications/admin'
          element={<SuperAdminnotifications />}
        />
        <Route path='/notifications/admin' element={<SuperAdminnotifications />} />

      </Route>
    </Routes>
  )
}

export default AppRoutes