const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  title: { type: String, required: true },
  unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  content: { type: String },
  doc: { type: String },
  lectureLink: { type: String },
  duration: { type: Number },
  completed: { type: Boolean },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);