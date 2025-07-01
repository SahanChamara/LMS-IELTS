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