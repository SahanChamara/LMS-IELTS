const mongoose = require("mongoose")
const ExamIeltsSubmission = require("../models/ExamIeltsSubmission");
const {ExamIelts, Sections, Question} = require("../models/ExamIelts");
const HttpStatus = require("../config/statusCode");

const validateRequiredFields = (requiredFields, data) => {
    const missingFields = requiredFields.filter((field) => !data[field]);
    return missingFields.length > 0 ? missingFields : null;
};

exports.createSubmission = async (req, res) => {
    const {studentId, examId, sectionIds, answers} = req.body;

    console.log("create submission body", req.body);

    const requiredFields = ["studentId", "examId", "sectionIds", "answers"];
    const missingFields = validateRequiredFields(requiredFields, req.body);
    if (missingFields) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
        const examExists = await ExamIelts.findById(examId);
        if (!examExists) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Exam not found",
            });
        }

        const sectionExists = await Sections.findById(sectionIds);
        if (!sectionExists || sectionExists.examId.toString() !== examId) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Section not found or does not belong to the exam",
            });
        }

/*        if (Object.keys(answers).length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "At least one answer is required",
            });
        }*/

        const submission = new ExamIeltsSubmission({
            studentId,
            examId,
            sectionIds,
            answers,
        });

        await submission.save();
        return res.status(HttpStatus.CREATED).json({
            success: true,
            data: submission,
            message: "Submission created successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating submission",
            error: error.message,
        });
    }
};

// Update Submission - this is used to partial updates during "in progress"
exports.updateSubmission = async (req, res) => {
    const { id } = req.params;
    const { answers, status, totalScore, feedback, metadata, sectionIds } = req.body;

    console.log("update submission body", req.body);

    try {
        const submission = await ExamIeltsSubmission.findById(id);
        if (!submission) {
            return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Submission not found" });
        }

        if(answers && typeof answers === "object" && !Array.isArray(answers)){
            const existingAnswers = Object.fromEntries(submission.answers);
            const updatedAnswers = {...existingAnswers, ...answers};
            submission.answers = new Map(Object.entries(updatedAnswers));
        }
        if (status && ["in-progress", "submitted", "graded", "reviewed"].includes(status)) submission.status = status;
        if (totalScore !== undefined) submission.totalScore = totalScore;
        if (feedback) submission.feedback = feedback;
        if(metadata && typeof metadata === "object" && !Array.isArray(metadata)){
            const existingMetadata = Object.fromEntries(submission.metadata);
            const updatedMetadata = {...existingMetadata, ...metadata};
            submission.metadata = new Map(Object.entries(updatedMetadata));
        }
        if (sectionIds) submission.sectionIds = sectionIds; // Add or update sectionIds

        await submission.save();
        return res.status(HttpStatus.OK).json({ success: true, data: submission, message: "Submission updated successfully" });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error updating submission", error: error.message });
    }
};

// This API is calling for user clicks the reviewed button on table
exports.getSubmissionById = async (req, res) => {
    const { id } = req.params;

    try {
        const submission = await ExamIeltsSubmission.findById(id).populate({
            path: "sectionId",
            populate: { path: "questions" },
        });

        if (!submission) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Submission not found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            data: submission,
            message: "Submission retrieved successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving submission",
            error: error.message,
        });
    }
};

// This Api is calling in user click the Finalize Review button
exports.gradeSubmission = async (req, res) => {
    const { id } = req.params;
    const { totalScore, feedback, status = "graded" } = req.body;

    try {
        const submission = await ExamIeltsSubmission.findById(id).populate({
            path: "sectionId",
            populate: { path: "questions" },
        });

        if (!submission) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Submission not found",
            });
        }

        if (totalScore === undefined || totalScore < 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Valid totalScore is required",
            });
        }

        submission.totalScore = totalScore;
        submission.feedback = feedback || submission.feedback;
        submission.status = status;

        await submission.save();
        return res.status(HttpStatus.OK).json({
            success: true,
            data: submission,
            message: "Submission graded successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error grading submission",
            error: error.message,
        });
    }
};