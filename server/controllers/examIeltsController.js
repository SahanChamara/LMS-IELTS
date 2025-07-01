const mongoose = require("mongoose");
const {ExamIelts, Section, Question} = require("../models/ExamIelts");
const Instructor = require("../models/Instructor");
const HttpsStatus = require("../config/statusCode");

const validateRequireFields = (requiredFields, data) => {
    const missingFields = requiredFields.filter((field) => !data[field]);
    return missingFields.length > 0 ? missingFields : null;
};

exports.createExam = async (req, res) => {
    const {title, description, duration, difficulty, type, createdBy} = req.body;

    const requiredFields = ["title", "description", "duration", "difficulty", "type", "createdBy"];
    const missingFields = validateRequireFields(requiredFields, req.body);
    if (missingFields) {
        return res.status(HttpsStatus.BAD_REQUEST).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
        const instructorExist = await Instructor.findById(createdBy);
        if (!instructorExist) {
            return res.status(HttpsStatus.NOT_FOUND).json({
                success: false,
                message: "Instructor Not Found"
            });
        }

        const existingExam = await ExamIelts.findOne({title, createdBy});
        if (existingExam) {
            return res.status(HttpsStatus.CONFLICT).json({
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
        return res.status(HttpsStatus.CREATED).json({
            success: true,
            data: exam,
            message: "Exam created successfully",
        });
    } catch (error) {
        return res.status(HttpsStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating exam",
            error: error.message,
        });
    }
};