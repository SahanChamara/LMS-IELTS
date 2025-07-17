const express = require("express");
const router = express.Router();
const examIeltsController = require("../controllers/examIeltsController");
const authMiddleware = require("../middleware/auth");

router.post('/exam', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createExam);
router.post('/sections', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createSection);
router.post('/questions', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createQuestion);
router.get('/exams/:examId', authMiddleware(["Student", "Instructor", "SuperAdmin"]), examIeltsController.getExamById);
router.get('/getAllExams', authMiddleware(["Student", "Instructor", "SuperAdmin"]), examIeltsController.getAllExams);
// router.delete('/:examId', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.);
router.put('/exams/:examId', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.updateExamStatus);
router.get('/published', authMiddleware(["Student", "Instructor", "SuperAdmin"]), examIeltsController.getAllPublishedExams);


module.exports = router;