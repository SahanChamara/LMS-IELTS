const express = require("express");
const router = express.Router();
const ExamIeltsSubmissionController = require("../controllers/examIeltsSubmissionController");
const authMiddleware = require("../middleware/auth");

router.post('/', authMiddleware(["Student"]), ExamIeltsSubmissionController.createSubmission);
router.put('/update/:id', authMiddleware(["Student"]), ExamIeltsSubmissionController.updateSubmission);
router.get('/getSubmission/:id', authMiddleware(["Instructor", "SuperAdmin"]), ExamIeltsSubmissionController.getSubmissionById);
router.post('/gradeSubmission/:id', authMiddleware(["Instructor", "SuperAdmin"]), ExamIeltsSubmissionController.gradeSubmission);

module.exports = router;