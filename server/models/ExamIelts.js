const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    duration: {type: Number, required: true}, // in minutes
    totalQuestions: {type: Number, default: 0},
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
    },
    type: {
        type: String,
        enum: ["Reading", "Writing", "Listening", "Speaking"],
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
    },
    available: {type: Boolean, default: false},
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
        index: true, // Index for RBAC
    },
    metadata: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {version: 1, category: "IELTS"}, // Extensible metadata
    },
    sections: [{type: Schema.Types.ObjectId, ref: "Sections"}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

// Question database schema
const QuestionSchema = new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Sections",
        required: true,
        index: true, // Index for efficient population
    },
    type: {
        type: String,
        enum: [
            "reading",
            "mcq",
            "typing",
            "essay",
            "form-completion",
            "matching",
            "oral",
        ],
        required: true,
    },
    question: { type: String, required: true },
    options: [String], // For mcq, matching
    passage: String, // For reading
    answer: String, // Optional, for auto-grading
    wordLimit: { type: Number, default: 0 }, // For essay
    points: { type: Number, required: true },
    order: { type: Number, required: true }, // Sequence within a section
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Section database Schema
const SectionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "ExamIelts",
        required: true,
        index: true, // Index for efficient population
    },
    title: { type: String, required: true },
    duration: Number, // Optional, section-specific duration
    audioUrl: String, // For Listening exams
    context: String, // For Listening exams
    instructions: String, // For Speaking exams
    preparationTime: { type: Number, default: 0 }, // For Speaking Part 2 (in seconds)
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    order: { type: Number, required: true }, // Sequence number for display
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update timestamps
[ExamSchema, SectionSchema, QuestionSchema].forEach(
    (schema) => {
        schema.pre("save", function (next) {
            this.updatedAt = Date.now();
            next();
        });
    }
);

const ExamIelts = mongoose.model("ExamIelts", ExamSchema);
const Sections = mongoose.model("Sections", SectionSchema);
const Question = mongoose.model("Question", QuestionSchema);

module.exports = {ExamIelts, Sections, Question};