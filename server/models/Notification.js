const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, refPath: 'recipientType', required: true },
  recipientType: { type: String, enum: ['Student', 'Instructor', 'SuperAdmin'], required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'grade', 'deadline', 'message'], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);