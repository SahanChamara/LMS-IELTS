const SubmissionAssignment = require("../models/SubmissionAssignment");
const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");
const HttpStatus = require("../config/statusCode");

const validateObjectIdOrThrow = (id, name = "ID") => {
    if (!id || !mongoose.isValidObjectId(id)) {
        const err = new Error(`Invalid ${name}`);
        err.statusCode = HttpStatus.BAD_REQUEST;
        throw err;
    }
};

exports.getAllSubmittedAssignment = async (req, res) => {
    try {
        const submission = await SubmissionAssignment.find()
            .populate("student", "name email")
            .populate("assignment", "title dueDate points unit")
            .sort({createdAt: -1})
            .lean();

        return res.status(HttpStatus.OK).json({
            success: true,
            data: submission
        });
    } catch (e) {
        console.error("getAllSubmittedAssignment error:", e);
        return res.status(e.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: e.message || "Failed to fetch submissions",
            error: e.message || e,
        });
    }
}

exports.updateSubmissionGrade = async (req, res) => {
    try {
        const {submissionId} = req.params;
        const {grade, feedback} = req.body;

        validateObjectIdOrThrow(submissionId, "submission ID");

        // Basic validation: require at least grade (you can relax this if you want)
        if (grade === undefined || grade === null || String(grade).trim() === "") {
            const err = new Error("grade is required");
            err.statusCode = HttpStatus.BAD_REQUEST;
            throw err;
        }

        const submission = await SubmissionAssignment.findById(submissionId);
        if (!submission) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Submission not found",
            });
        }

        // Update fields
        submission.grade = grade;
        if (feedback !== undefined) submission.instructorFeedback = feedback;
        submission.gradedAt = Date.now();
        // mark updatedAt if your schema has timestamps
        await submission.save();

        // return populated doc for convenience
        const updated = await SubmissionAssignment.findById(submissionId)
            .populate("student", "name email")
            .populate("assignment", "title unit dueDate points")
            .lean();

        return res.status(HttpStatus.OK).json({
            success: true,
            data: updated,
            message: "Submission grade updated successfully",
        });
    } catch (error) {
        console.error("updateSubmissionGrade error:", error);
        return res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to update submission grade",
            error: error.message || error,
        });
    }
}

    exports.getSubmissionsByUnit = async (req, res) => {
        try {
            const {unitId} = req.params;
            validateObjectIdOrThrow(unitId, "unit ID");

            // Get submissions and populate assignment and student
            const submissions = await SubmissionAssignment.find()
                .populate("student", "name email")
                .populate({
                    path: "assignment",
                    select: "title unit dueDate points", // fields we need from assignment
                })
                .sort({createdAt: -1})
                .lean();

            // Filter only those where populated assignment exists and assignment.unit matches unitId
            const filtered = submissions.filter((s) => {
                if (!s.assignment) return false;
                // assignment.unit may be ObjectId or object with _id
                const aUnit = s.assignment.unit;
                // compare as strings
                return String(aUnit) === String(unitId);
            });

            return res.status(HttpStatus.OK).json({
                success: true,
                data: filtered,
            });
        } catch (error) {
            console.error("getSubmissionsByUnit error:", error);
            return res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to fetch submissions for unit",
                error: error.message || error,
            });
        }
    }

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