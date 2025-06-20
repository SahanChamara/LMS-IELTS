const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuditLogSchema = new Schema({
  action: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, refPath: 'userType', required: true },
  userType: { type: String, enum: ['Student', 'Instructor', 'SuperAdmin'], required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);