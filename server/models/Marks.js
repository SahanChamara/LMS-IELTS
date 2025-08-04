const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student ID is required"],
        index: true, // Optimize queries by student
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: null, // Optional, for linking to course metadata
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: [true, "Unit name is required"],
    },
    caMarks: {
        type: Number,
        min: [0, "CA marks cannot be negative"],
        max: [100, "CA marks cannot exceed 100"],
        default: null, // Allows "N/A"
    },
    examMarks: {
        type: Number,
        min: [0, "Exam marks cannot be negative"],
        max: [100, "Exam marks cannot exceed 100"],
        default: null, // Allows "N/A"
    },
    totalMarks: {
        type: Number,
        min: [0, "Total marks cannot be negative"],
        max: [100, "Total marks cannot exceed 100"],
        default: null, // Allows "N/A"
    },
    grade: {
        type: String,
        trim: true,
        maxlength: [5, "Grade cannot exceed 5 characters"], // e.g., "A+", "4.0"
        default: null, // Allows "N/A"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` timestamp on save
MarksSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient querying by studentId
MarksSchema.index({ studentId: 1 });

module.exports = mongoose.model("Mark", MarksSchema);