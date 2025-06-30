const SubmissionAssignment = require("../models/SubmissionAssignment");
const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");
const HttpStatus = require("../config/statusCode");

exports.createAssignmentSubmission = async (req, res) => {
    const {student, assignment, file, feedback, totalMarks} = req.body;

    if (!student || !assignment || !file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Student, assignment, and file are required'
        });
    }

    const assignmentExist = await Assignment.findById(assignment);
    if (!assignmentExist) {
        return res.status(HttpStatus.NOT_FOUND).json({success: false, message: "Assignment Not Found"});
    }

    const submission = new SubmissionAssignment({
        student,
        assignment,
        file,
        feedback,
        totalMarks
    });

    await submission.save();
    return res.status(HttpStatus.CREATED).json({
        success: true,
        data: submission,
        message: "Assignment Submit Successfully"
    });
}