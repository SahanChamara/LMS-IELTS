const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), calendarController.createCalendarEvent);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), calendarController.getCalendarEvents);
router.get('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), calendarController.getCalendarEventById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), calendarController.updateCalendarEvent);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), calendarController.deleteCalendarEvent);

module.exports = router;