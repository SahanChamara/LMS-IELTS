const Marks = require('../models/Marks');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Create a new mark
exports.createMark = async (req, res) => {
    try {
        const { caMarks, examMarks, maxMarks, student } = req.body;

        // Validate required fields
        if (maxMarks === undefined || !student) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks and student are required',
            });
        }

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Validate marks if provided
        if ((caMarks !== undefined && caMarks < 0) || (examMarks !== undefined && examMarks < 0)) {
            return res.status(400).json({
                success: false,
                message: 'caMarks and examMarks cannot be negative',
            });
        }
        if (maxMarks <= 0) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks must be greater than 0',
            });
        }

        // Check if a marks document exists for the student
        let existingMarks = await Marks.findOne({ student });

        let newTotalMarks = existingMarks ? existingMarks.totalMarks || 0 : 0;
        if (caMarks !== undefined) newTotalMarks += caMarks;
        if (examMarks !== undefined) newTotalMarks += examMarks;


        let marks;
        if (existingMarks) {
            // Update existing document
            existingMarks.caMarks = caMarks !== undefined ? (existingMarks.caMarks || 0) + caMarks : existingMarks.caMarks;
            existingMarks.examMarks = examMarks !== undefined ? (existingMarks.examMarks || 0) + examMarks : existingMarks.examMarks;
            existingMarks.totalMarks = newTotalMarks;
            existingMarks.maxMarks = existingMarks.maxMarks + maxMarks;
            existingMarks.updatedAt = Date.now();
            await existingMarks.save();
            marks = existingMarks;
        } else {
            // Create new document
            marks = new Marks({
                caMarks,
                examMarks,
                totalMarks: newTotalMarks,
                maxMarks,
                student,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            await marks.save();
        }

        res.status(201).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating mark',
            error: error.message,
        });
    }
};

// Get all marks
exports.getMark = async (req, res) => {
    try {
        const marks = await Marks.find()
            .populate('student', 'name email studentId')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching marks',
            error: error.message,
        });
    }
};

// Get marks by student ID
exports.getMarkByStudentId = async (req, res) => {
    try {
        const { id: studentId } = req.params;

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }

        // Verify student exists
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Fetch marks for the specified student
        const marks = await Marks.find({ student: studentId })
            .populate('student', 'name email studentId')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching marks by student',
            error: error.message,
        });
    }
};

// Get a single mark by ID
exports.getMarkById = async (req, res) => {
    try {
        const marks = await Marks.findById(req.params.id).populate(
            'student',
            'name email studentId'
        );

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: 'Marks not found',
            });
        }

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching mark',
            error: error.message,
        });
    }
};

// Update a mark
exports.updateMark = async (req, res) => {
    try {
        const { caMarks, examMarks, maxMarks, student } = req.body;

        // Validate student if provided
        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid student ID',
                });
            }
            const studentExists = await Student.findById(student);
            if (!studentExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found',
                });
            }
        }

        // Fetch existing marks document
        const existingMarks = await Marks.findById(req.params.id);
        if (!existingMarks) {
            return res.status(400).json({
                success: false,
                message: 'Marks not found',
            });
        }

        // Validate marks if provided
        if ((caMarks !== undefined && caMarks < 0) || (examMarks !== undefined && examMarks < 0)) {
            return res.status(400).json({
                success: false,
                message: 'caMarks and examMarks cannot be negative',
            });
        }
        if (maxMarks !== undefined && maxMarks <= 0) {
            return res.status(400).json({
                success: 'maxMarks must be greater than 0',
                error: error
            });
        }

        // Calculate new totalMarks
        let newTotalMarks = existingMarks.totalMarks || 0;
        let newCaMarks = existingMarks.caMarks || 0;
        let newExamMarks = existingMarks.examMarks || 0;

        if (caMarks !== undefined) {
            // Add new caMarks to existing caMarks
            newCaMarks += caMarks;
            // Update totalMarks by adding the new caMarks
            newTotalMarks += caMarksMarks;
        }

        if (examMarks !== undefined) {
            // Add new examMarks to existing examMarks
            newExamMarks += examMarks;
            // Update totalMarks by adding the new examMarks
            newTotalMarks += examMarks;
        }

        // Validate totalMarks does not exceed maxMarks
        const finalMaxMarks = maxMarks !== undefined ? maxMarks : existingMarks.maxMarks;
        if (newTotalMarks > finalMaxMarks) {
            return res.status(400).json({
                success: false,
                message: 'Total marks cannot exceed maxMarks',
            });
        }

        // Ensure at least one field is provided for update
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update',
            });
        }

        // Prepare update data
        const updateData = {
            ...(caMarks !== undefined && { caMarks: newCaMarks }),
            ...(examMarks !== undefined && { examMarks: newExamMarks }),
            ...(newTotalMarks !== existingMarks.totalMarks && { totalMarks: newTotalMarks }),
            ...(maxMarks !== undefined && { maxMarks }),
            ...(student && { student }),
            updatedAt: Date.now(),
        };

        // Update marks
        const marks = await Marks.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating mark',
            error: error.message,
        });
    }
};

// Delete a mark
exports.deleteMark = async (req, res) => {
    try {
        const marks = await Marks.findById(req.params.id);

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: 'Marks not found',
            });
        }

        // Delete marks
        await marks.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Marks deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting mark',
            error: error.message,
        });
    }
};
