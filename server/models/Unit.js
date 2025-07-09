const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
  title: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  subUnits: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  image: { type: String },
  unitCode: { type: String, unique: true },
  assessments: [{ type: Schema.Types.ObjectId, ref: 'Assessment' }],
  credits: { type: String },
  exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],
  studyMaterials: [{ url: String, title: String, type: String }],
  discussions: [{
    question: String,
    answers: [{
      user: { type: Schema.Types.ObjectId, refPath: 'discussions.userType' },
      content: String,
      createdAt: Date
    }],
    userType: { type: String, enum: ['Student', 'Instructor'] }
  }],
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "Instructor" },
  quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  timePeriod: { type: Number, required: true },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strictPopulate: false });

UnitSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Unit', UnitSchema);