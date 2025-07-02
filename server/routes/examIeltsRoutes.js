const express = require("express");
const router = express.Router();
const examIeltsController = require("../controllers/examIeltsController");
const authMiddleware = require("../middleware/auth");

router.post('/exam', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createExam);
router.post('/sections', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createSection);
router.post('/questions', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.createQuestion);
router.get('/:examId', authMiddleware(["Student", "Instructor", "SuperAdmin"]), examIeltsController.getExamById);
// router.delete('/:examId', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.);
router.put('/:examId', authMiddleware(["Instructor", "SuperAdmin"]), examIeltsController.updateExamStatus);


module.exports = router;