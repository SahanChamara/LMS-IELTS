const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarEventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  type: { type: String, enum: ['exam', 'assessment', 'event', 'class'], required: true },
  relatedId: { type: Schema.Types.ObjectId, refPath: 'relatedType' },
  relatedType: { type: String, enum: ['Exam', 'Assessment', 'Course'] },
  recipients: [{ type: Schema.Types.ObjectId, refPath: 'recipientType' }],
  recipientType: { type: String, enum: ['Student', 'Instructor'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);