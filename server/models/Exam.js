const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
  title: { type: String, required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  description: { type: String },
  date: { type: Date },
  location: { type: String },
  duration: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);