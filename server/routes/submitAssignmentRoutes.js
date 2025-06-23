const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/auth");
const submissionAssignmentController = require("../controllers/")


router.post("/", authMiddleware(["Student","Instructor"]), submissionAssignmentController);

module.exports = router;