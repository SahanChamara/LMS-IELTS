const Assessment = require('./Assessment');
const Assignment = require('./Assignment');
const AuditLog = require('./AuditLog');
const Certificate = require('./Certificate');
const Course = require('./Course');
const Discussion = require('./Discussion');
const Exam = require('./Exam');
const Instructor = require('./Instructor');
const Lesson = require('./Lesson');
const Logs = require('./Logs');
const Marks = require('./Marks');
const Notification = require('./Notification');
const onlineSession = require('./onlineSession');
const Quiz = require('./Quiz');
const Report = require('./Report');
const Student = require('./Student');
const Submission = require('./Submission');
const SubmissionAssignment = require('./SubmissionAssignment');
const SuperAdmin = require('./SuperAdmin');
const Unit = require('./Unit');
const Post = require('./Post');
const Announcement = require('./Announcements');


// index.js
module.exports = {
  Assessment: require('./Assessment'),
  AuditLog: require('./AuditLog'),
  Certificate: require('./Certificate'),
  Course: require('./Course'),
  Exam: require('./Exam'),
  Instructor: require('./Instructor'),
  Lesson: require('./Lesson'),
  Notification: require('./Notification'),
  Report: require('./Report'),
  Student: require('./Student'),
  Submission: require('./Submission'),
  SuperAdmin: require('./SuperAdmin'),
  Unit: require('./Unit'),
  Quiz: require('./Quiz'),
  Marks: require('./Marks'),
  Assignment: require('./Assignment'),
  SubmissionAssignment: require('./SubmissionAssignment'),
  Discussion: require('./Discussion'),
  OnlineSession: require('./onlineSession'),
  Logs: require('./Logs'),
  Post: require('./Post'),
  Announcement: require('./Announcements')
};

module.exports = {
  Assessment,
  AuditLog,
  Certificate,
  Course,
  Exam,
  Instructor,
  Lesson,
  Notification,
  Report,
  Student,
  Submission,
  SuperAdmin,
  Unit,
  Quiz,
  Marks,
  Assignment,
  SubmissionAssignment,
  Discussion,
  onlineSession,
  Logs,
  Post,
  Announcement

};