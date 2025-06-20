const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamMarksSchema = new Schema({
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    maxMarks: { type: Number, required: true },
    weight:{ type: Number, required: true},
    marks: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model( 'ExamMarks', ExamMarksSchema);