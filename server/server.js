require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const unitRoutes = require("./routes/unitRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const examRoutes = require("./routes/examRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const reportRoutes = require("./routes/reportRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const marksRoutes = require("./routes/markRoutes");
const assessmentMarkRoutes = require("./routes/assessmentMarksRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const assignmentMarkRoutes = require("./routes/assignmentMarksRoutes");
const examMarkRoutes = require("./routes/examMarksRoutes");
const submitAssignmentRoutes = require("./routes/submitAssignmentRoutes");
const onlineSessionRoutes = require("./routes/onlineSessionRoutes");
const logsRoutes= require("./routes/logsRoutes");
const examIeltsRoutes = require("./routes/examIeltsRoutes");
const examIeltsSubmissionRoutes = require("./routes/examIeltsSubmissionRoutes");
const postRoutes = require("./routes/postRoutes");
const AnnouncementRoutes = require("./routes/announcementRoutes");
const responseFormatter = require("./middleware/responseFormatter");
const { default: mongoose } = require("mongoose");

console.log("Environment Variables:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : undefined);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "[REDACTED]" : undefined);
console.log("MONGO_URI:", process.env.MONGO_URI ? "[REDACTED]" : undefined);
console.log("PORT:", process.env.PORT);

const app = express();
connectDB();
mongoose.set('debug', true);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(responseFormatter())

app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/auditLogs", auditLogRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/assessmentMarks", assessmentMarkRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/assignmentMarks", assignmentMarkRoutes);
app.use("/api/examMarks", examMarkRoutes);
app.use("/api/submitAssignment", submitAssignmentRoutes);
app.use("/api/onlineSession", onlineSessionRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/examIelts", examIeltsRoutes);
app.use("/api/posts", postRoutes );
app.use("/api/examIeltsSubmission", examIeltsSubmissionRoutes);
app.use("/api/announcement", AnnouncementRoutes)

app.use(require("./middleware/errorHandler"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Server error", error: err.message});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});