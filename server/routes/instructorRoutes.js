const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
  addCourse,
  addNotification,
  addCalendarEvent,
} = require("../controllers/instructorController");

router.post('/', auth(['SuperAdmin']), createInstructor);
router.get('/', auth(['SuperAdmin', 'Instructor']), getAllInstructors);
router.get('/:id', auth(['SuperAdmin', 'Instructor']), getInstructorById);
router.put('/:id', auth(['SuperAdmin', 'Instructor']), updateInstructor);
router.delete('/:id', auth(['SuperAdmin']), deleteInstructor);
router.post('/:id/courses', auth(['SuperAdmin', 'Instructor']), addCourse);
router.post('/:id/notifications', auth(['SuperAdmin', 'Instructor']), addNotification);
router.post('/:id/calendarEvents', auth(['SuperAdmin', 'Instructor']), addCalendarEvent);

module.exports = router;
