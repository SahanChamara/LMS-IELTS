const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/auth");
const submitAssignmentController = require("../controllers/submitAssignmentController")


router.post("/", authMiddleware(["Student","Instructor"]), submitAssignmentController.createAssignmentSubmission);

module.exports = router;