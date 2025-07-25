const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: {type: String, index:true},
  profile: {
    photo:{ type: String,},
    phone: { type: String },
    country:{type:String, default:'Sri Lanka'},
    city:{type:String, default:'Colombo'},
    DOB:{type:String, default:'0000-00-00'},
    preferences: {
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' }
    }
  },
  enrolledCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
  completedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Student', StudentSchema);