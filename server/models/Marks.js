const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarksSchema = new Schema({
    caMarks: { type: Number},
    examMarks: { type: Number},
    totalMarks: { type: Number},
    maxMarks: { type: Number, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Marks', MarksSchema);