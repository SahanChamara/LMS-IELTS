const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const examMarksController = require("../controllers/examMarksController");

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), examMarksController.createExam);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), examMarksController.getExam);
router.get('/student/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), examMarksController.getExamByStudentId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examMarksController.getExamById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examMarksController.updateExam);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examMarksController.deleteExam);

module.exports = router;