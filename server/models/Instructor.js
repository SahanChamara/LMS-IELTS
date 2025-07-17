const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  refreshToken: {type: String, index: true},
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  calendarEvents: [{ type: Schema.Types.ObjectId, ref: 'CalendarEvent' }],
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Instructor || mongoose.model('Instructor', InstructorSchema);