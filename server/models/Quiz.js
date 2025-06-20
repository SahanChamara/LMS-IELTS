// Quiz.js
const mongoose = require('mongoose');
const marks = require('./Marks');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    question: { type: String, required: true},
    options: [{ type: [String], required: true }],
    answer: { type: Number, required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    mark: { type: Number,required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);