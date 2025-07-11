const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ExamSubmissionSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    examId: { type: Schema.Types.ObjectId, ref: "ExamIelts", required: true, index: true },
    sectionIds: [{ type: Schema.Types.ObjectId, ref: "Sections", required: true, index: true }],
    submissionDate: { type: Date, default: Date.now, index: true },
    answers: { type: Map, of: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ["in-progress", "submitted", "graded", "reviewed"], default: "in-progress" },
    totalScore: { type: Number, default: 0 },
    feedback: { type: String, default: null },
    metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ExamSubmissionSchema.pre("save", function (next){
    this.updatedAt = Date.now();
    next();
});

const ExamIeltsSubmission = mongoose.model("ExamSubmission", ExamSubmissionSchema);
module.exports = ExamIeltsSubmission;