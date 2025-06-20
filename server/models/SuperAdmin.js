const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SuperAdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);