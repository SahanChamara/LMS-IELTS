const express = require("express");
const router = express.Router();
const ExamIeltsSubmissionController = require("../controllers/examIeltsSubmissionController");
const authMiddleware = require("../middleware/auth");

router.post('/', authMiddleware(["Student"]), ExamIeltsSubmissionController.createSubmission);

module.exports = router;