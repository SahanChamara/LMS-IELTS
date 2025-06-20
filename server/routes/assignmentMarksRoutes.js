const express = require('express');
const router = express.Router();
const assignmentMarksController = require('../controllers/assignmentMarksController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), assignmentMarksController.createMark);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assignmentMarksController.getMark);
router.get('/student/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assignmentMarksController.getMarkByStudentId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentMarksController.getMarkById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentMarksController.updateMark);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentMarksController.deleteMark);

module.exports = router;