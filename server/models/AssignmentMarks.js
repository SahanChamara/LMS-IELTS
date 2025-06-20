const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentMarksSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    maxMarks: { type: Number, required: true },
    weight:{ type: Number, required: true},
    marks: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('AssignmentMarks', AssignmentMarksSchema);