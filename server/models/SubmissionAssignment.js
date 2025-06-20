const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//assignmentSubmision

const SubmissionAssignmentSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    file: { type: String , default: '', required: true},
    feedback: { type: String },
    score: { type: Number },
    totalMarks: { type: Number },
    grade: { type: String , enum: ['pass', 'fail'], default: 'fail'},
    submittedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubmissionAssignment', SubmissionAssignmentSchema);