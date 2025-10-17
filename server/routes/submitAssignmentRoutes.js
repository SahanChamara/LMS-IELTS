const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/auth");
const submitAssignmentController = require("../controllers/submitAssignmentController")


router.post("/", authMiddleware(["Student","Instructor"]), submitAssignmentController.createAssignmentSubmission);
router.get("/getAllSubmissions", authMiddleware(["Student", "Instructor"]), submitAssignmentController.getAllSubmittedAssignment);
router.get("/submissions/unit/:unitId", authMiddleware(["Student", "Instructor"]), submitAssignmentController.getSubmissionsByUnit);
router.put("/submissions/:submissionId/grade", authMiddleware(["student", "Instructor"]), submitAssignmentController.updateSubmissionGrade);

module.exports = router;