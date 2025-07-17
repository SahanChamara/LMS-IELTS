const mongoose = require("mongoose");
const {ExamIelts, Sections, Question} = require("../models/ExamIelts");
const Instructor = require("../models/Instructor");
const HttpStatus = require("../config/statusCode");

const validateRequireFields = (requiredFields, data) => {
    const missingFields = requiredFields.filter((field) => !data[field]);
    return missingFields.length > 0 ? missingFields : null;
};

exports.createExam = async (req, res) => {
    const {title, description, duration, difficulty, type, createdBy} = req.body;

    const requiredFields = ["title", "description", "duration", "difficulty", "type", "createdBy"];
    const missingFields = validateRequireFields(requiredFields, req.body);
    if (missingFields) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
        const instructorExist = await Instructor.findById(createdBy);
        if (!instructorExist) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Instructor Not Found"
            });
        }

        const existingExam = await ExamIelts.findOne({title, createdBy});
        if (existingExam) {
            return res.status(HttpStatus.CONFLICT).json({
                success: false,
                message: "An exam with this title already exists for this instructor",
            });
        }

        const exam = new ExamIelts({
            title,
            description,
            duration,
            difficulty,
            type,
            createdBy,
        });

        await exam.save();
        return res.status(HttpStatus.CREATED).json({
            success: true,
            data: exam,
            message: "Exam created successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating exam",
            error: error.message,
        });
    }
};


exports.createSection = async (req, res) => {
    const {examId, title, duration, audioUrl, context, instructions, preparationTime, order} = req.body;

    const requiredFields = ["examId", "title", "order"];
    const missingFields = validateRequireFields(requiredFields, req.body);
    if (missingFields) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
        const examExist = await ExamIelts.findById(examId);
        if (!examExist) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Exam not found",
            });
        }

        const section = new Sections({
            examId,
            title,
            duration,
            audioUrl,
            context,
            instructions,
            preparationTime,
            order,
        });

        await section.save();

        // Updating the exam table sections array for pushing the sections ids....
        examExist.sections.push(section._id);
        await examExist.save();

        return res.status(HttpStatus.CREATED).json({
            success: true,
            data: section,
            message: "Section created successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating section",
            error: error.message,
        });
    }
};

// Question Create
exports.createQuestion = async (req, res) => {
    const {sectionId, type, question, options, passage, answer, wordLimit, points, order} = req.body;

    const requiredFields = ["sectionId", "type", "question", "points", "order"];
    const missingFields = validateRequireFields(requiredFields, req.body);
    if (missingFields) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    // Validating the specific types
    if (["mcq", "matching"].includes(type) && (!options || !Array.isArray(options) || options.length === 0)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: "Options are required for mcq or matching type",
        });
    }
    if (type === "essay" && wordLimit <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: "Word limit must be greater than 0 for essay type",
        });
    }

    try {
        const sectionExists = await Sections.findById(sectionId);
        if (!sectionExists) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Section not found",
            });
        }

        const questionDoc = new Question({
            sectionId,
            type,
            question,
            options,
            passage,
            answer,
            wordLimit,
            points,
            order,
        });

        await questionDoc.save();

        sectionExists.questions.push(questionDoc._id);
        await sectionExists.save();

        const exam = await ExamIelts.findById(sectionExists.examId);
        exam.totalQuestions += 1;
        await exam.save();

        return res.status(HttpStatus.CREATED).json({
            success: true,
            data: questionDoc,
            message: "Question created successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating question",
            error: error.message,
        });
    }
}

// Get Exam by id
// user click start exam now button and calling this api...
exports.getExamById = async (req, res) => {
    const {examId} = req.params;

    try {
        const exam = await ExamIelts.findById(examId)
            .populate("sections")
            .populate({
                path: "sections",
                populate: {path: "questions"},
            });

        if (!exam) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Exam Not Found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            data: exam,
            message: "Exam retrieved successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving exam",
            error: error.message,
        });
    }
};

// Update Exam Status
exports.updateExamStatus = async (req, res) => {
    const {examId} = req.params;
    const {status, available} = req.body;

    try {
        const exam = await ExamIelts.findById(examId);
        if (!exam) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Exam not found",
            });
        }

        if (status && !["draft", "published", "archived"].includes(status)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        exam.status = status || exam.status;
        exam.available = available !== undefined ? available : exam.available;
        await exam.save();

        return res.status(HttpStatus.OK).json({
            success: true,
            data: exam,
            message: "Exam status updated successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating exam status",
            error: error.message,
        });
    }
}

// Get all exams with status "published" and available true
exports.getAllPublishedExams = async (req, res) => {
    try {
        const exams = await ExamIelts.find({
            status: "published",
            available: true,
        })
/*            .populate("sections")
            .populate({
                path: "sections",
                populate: { path: "questions" },
            });*/

        if (!exams || exams.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "No published and available exams found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            data: exams,
            message: "Published and available exams retrieved successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving published exams",
            error: error.message,
        });
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const exams = await ExamIelts.find();
        if (!exams || exams.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "No exams found",
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            data: exams,
            message: "exams retrieved successfully",
        });
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error retrieving exams",
            error: error.message,
        });
    }
};

