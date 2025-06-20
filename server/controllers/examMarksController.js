const ExamMarks = require('../models/ExamMarks');
const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Exam = require('../models/Exam');
const mongoose = require('mongoose');

// Create a new exam mark
exports.createExam = async (req, res) => {
    try {
        const { exam, student, maxMarks, weight, marks } = req.body;

        // Validate required fields
        if (!exam || !student || maxMarks === undefined || weight === undefined || marks === undefined) {
            return res.status(400).json({
                success: false,
                message: 'exam, student, maxMarks, weight, and marks are required',
            });
        }

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({ success: false, message: 'Invalid student ID' });
        }
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Validate exam ID
        if (!mongoose.Types.ObjectId.isValid(exam)) {
            return res.status(400).json({ success: false, message: 'Invalid exam ID' });
        }
        const examExists = await Exam.findById(exam);
        if (!examExists) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        // Validate numeric fields
        if (maxMarks <= 0 || weight <= 0 || marks < 0) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks and weight must be greater than 0, marks cannot be negative',
            });
        }
        if (marks > maxMarks) {
            return res.status(400).json({
                success: false,
                message: 'marks cannot exceed maxMarks',
            });
        }

        // Calculate adjusted marks
        const adjustedMarks = (marks / maxMarks) *  weight;

        // Create exam marks document
        const examMark = new ExamMarks({
            exam,
            student,
            maxMarks,
            weight,
            marks,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Save exam marks
        const response = await examMark.save();
        console.log(response);

        // Update Marks collection
        let marksDoc = await Marks.findOne({ student });
        console.log(marksDoc);
        if (marksDoc) {
            marksDoc.examMarks = (marksDoc.examMarks || 0) + adjustedMarks;
            marksDoc.totalMarks = (marksDoc.totalMarks || 0) + adjustedMarks;
            marksDoc.maxMarks = (marksDoc.maxMarks || 0) + weight;
            marksDoc.updatedAt = Date.now();

            const response = await marksDoc.save();
            console.log(response);
        } else {
            // Create new Marks document
            marksDoc = new Marks({
                examMarks: adjustedMarks,
                totalMarks: adjustedMarks,
                maxMarks: Math.max(maxMarks, examExists.totalMarks || 100), // Use reasonable default
                student,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            const response = await marksDoc.save();
            console.log(response);
        }

        res.status(201).json({ success: true, data: examMark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating exam mark',
            error: error.message,
        });
    }
};

// Get all exam marks
exports.getExam = async (req, res) => {
    try {
        const marks = await ExamMarks.find()
            .populate('student', 'name email studentId')
            .populate('exam', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exam marks',
            error: error.message,
        });
    }
};

// Get exam marks by student ID
exports.getExamByStudentId = async (req, res) => {
    try {
        const { id: studentId } = req.params;

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ success: false, message: 'Invalid student ID' });
        }

        // Verify student exists
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Fetch marks for the specified student
        const marks = await ExamMarks.find({ student: studentId })
            .populate('student', 'name email studentId')
            .populate('exam', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exam marks by student',
            error: error.message,
        });
    }
};

// Get a single exam mark by ID
exports.getExamById = async (req, res) => {
    try {
        const mark = await ExamMarks.findById(req.params.id)
            .populate('student', 'name email studentId')
            .populate('exam', 'title');

        if (!mark) {
            return res.status(404).json({ success: false, message: 'Exam mark not found' });
        }

        res.status(200).json({ success: true, data: mark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching exam mark',
            error: error.message,
        });
    }
};

// Update an exam mark
exports.updateExam = async (req, res) => {
    try {
        const { exam, student, maxMarks, weight, marks } = req.body;

        // Fetch existing exam mark
        const existingMark = await ExamMarks.findById(req.params.id);
        if (!existingMark) {
            return res.status(404).json({ success: false, message: 'Exam mark not found' });
        }

        // Validate student if provided
        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student)) {
                return res.status(400).json({ success: false, message: 'Invalid student ID' });
            }
            const studentExists = await Student.findById(student);
            if (!studentExists) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }
        }

        // Validate exam if provided
        if (exam) {
            if (!mongoose.Types.ObjectId.isValid(exam)) {
                return res.status(400).json({ success: false, message: 'Invalid exam ID' });
            }
            const examExists = await Exam.findById(exam);
            if (!examExists) {
                return res.status(404).json({ success: false, message: 'Exam not found' });
            }
        }

        // Validate numeric fields if provided
        if ((maxMarks !== undefined && maxMarks <= 0) || (weight !== undefined && weight <= 0) || (marks !== undefined && marks < 0)) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks and weight must be greater than 0, marks cannot be negative',
            });
        }
        if (marks !== undefined && maxMarks !== undefined && marks > maxMarks) {
            return res.status(400).json({
                success: false,
                message: 'marks cannot exceed maxMarks',
            });
        }

        // Ensure at least one field is provided for update
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update',
            });
        }

        // Calculate old and new adjusted marks
        const oldAdjustedMarks = (existingMark.marks / existingMark.maxMarks) * 100 / existingMark.weight;
        const newAdjustedMarks = marks !== undefined && maxMarks !== undefined && weight !== undefined
            ? (marks / maxMarks) * 100 / weight
            : marks !== undefined && maxMarks !== undefined
                ? (marks / maxMarks) * 100 / existingMark.weight
                : marks !== undefined && weight !== undefined
                    ? (marks / existingMark.maxMarks) * 100 / weight
                    : maxMarks !== undefined && weight !== undefined
                        ? (existingMark.marks / maxMarks) * 100 / weight
                        : marks !== undefined
                            ? (marks / existingMark.maxMarks) * 100 / existingMark.weight
                            : maxMarks !== undefined
                                ? (existingMark.marks / maxMarks) * 100 / existingMark.weight
                                : weight !== undefined
                                    ? (existingMark.marks / existingMark.maxMarks) * 100 / weight
                                    : oldAdjustedMarks;

        // Update Marks collection
        let marksDoc = await Marks.findOne({ student: student || existingMark.student });
        if (!marksDoc) {
            // Create new Marks document if none exists
            marksDoc = new Marks({
                examMarks: newAdjustedMarks,
                totalMarks: newAdjustedMarks,
                maxMarks: maxMarks !== undefined ? maxMarks : existingMark.maxMarks,
                student: student || existingMark.student,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        } else {
            // Adjust examMarks and totalMarks
            marksDoc.examMarks = (marksDoc.examMarks || 0) - oldAdjustedMarks + newAdjustedMarks;
            marksDoc.totalMarks = (marksDoc.totalMarks || 0) - oldAdjustedMarks + newAdjustedMarks;
            marksDoc.maxMarks = maxMarks !== undefined ? Math.max(marksDoc.maxMarks, maxMarks) : marksDoc.maxMarks;
            marksDoc.updatedAt = Date.now();
            // Validate totalMarks
            if (marksDoc.totalMarks > marksDoc.maxMarks) {
                return res.status(400).json({
                    success: false,
                    message: 'Total marks in Marks collection cannot exceed maxMarks',
                });
            }
        }
        await marksDoc.save();

        // Prepare update data for ExamMarks
        const updateData = {
            ...(exam && { exam }),
            ...(student && { student }),
            ...(maxMarks !== undefined && { maxMarks }),
            ...(weight !== undefined && { weight }),
            ...(marks !== undefined && { marks }),
            updatedAt: Date.now(),
        };

        // Update exam mark
        const updatedMark = await ExamMarks.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedMark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating exam mark',
            error: error.message,
        });
    }
};

// Delete an exam mark
exports.deleteExam = async (req, res) => {
    try {
        const mark = await ExamMarks.findById(req.params.id);
        if (!mark) {
            return res.status(404).json({ success: false, message: 'Exam mark not found' });
        }

        // Calculate adjusted marks to remove
        const adjustedMarks = (mark.marks / mark.maxMarks) * 100 / mark.weight;

        // Update Marks collection
        const marksDoc = await Marks.findOne({ student: mark.student });
        if (marksDoc) {
            marksDoc.examMarks = Math.max(0, (marksDoc.examMarks || 0) - adjustedMarks);
            marksDoc.totalMarks = Math.max(0, (marksDoc.totalMarks || 0) - adjustedMarks);
            marksDoc.updatedAt = Date.now();
            await marksDoc.save();
        }

        // Delete exam mark
        await mark.deleteOne();

        res.status(200).json({ success: true, message: 'Exam mark deleted successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting exam mark',
            error: error.message,
        });
    }
};