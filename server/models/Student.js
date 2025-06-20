const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: {type: String},
  profile: {
    phone: { type: String },
    address: { type: String },
    preferences: {
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' }
    }
  },
  enrolledCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
  completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  assessments: [{
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    submission: { type: Schema.Types.ObjectId, ref: 'Submission' },
    status: { type: String, enum: ['on-time', 'late', 'pending'], default: 'pending' }
  }],
  exams: [{
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    score: { type: Number },
    feedback: { type: String }
  }],
  certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  calendarEvents: [{ type: Schema.Types.ObjectId, ref: 'CalendarEvent' }],
  performance: {
    overallAverage: { type: Number, default: 0 },
    assessmentAverage: { type: Number, default: 0 },
    examAverage: { type: Number, default: 0 },
    progress: {
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
      percentage: { type: Number }
    }
  },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Student', StudentSchema);