const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), lessonController.createLesson);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), lessonController.getLessons);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), lessonController.getLessonById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), lessonController.updateLesson);
router.put('/:id/completed', authMiddleware(['Instructor', 'SuperAdmin', 'Student']), lessonController.updateLessonCompleted);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), lessonController.deleteLesson);


module.exports = router;
