const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Unit = require('../models/Unit');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Create a new mark
exports.createMark = async (req, res) => {
    try {
        const { studentId, courseId, unit, caMarks, examMarks, grade } = req.body;

        // Validate required fields
        if (!studentId || !unit) {
            return res.status(400).json({
                success: false,
                message: 'studentId and unit are required',
            });
        }

        // Validate student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID',
            });
        }
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Validate unit ID
        if (!mongoose.Types.ObjectId.isValid(unit)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid unit ID',
            });
        }
        const unitExists = await Unit.findById(unit);
        if (!unitExists) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found',
            });
        }

        // Validate course ID if provided
        if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID',
            });
        }
        if (courseId) {
            const courseExists = await Course.findById(courseId);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }
        }

        // Validate marks if provided
        if ((caMarks !== undefined && (caMarks < 0 || caMarks > 100)) || 
            (examMarks !== undefined && (examMarks < 0 || examMarks > 100))) {
            return res.status(400).json({
                success: false,
                message: 'caMarks and examMarks must be between 0 and 100',
            });
        }

        // Calculate totalMarks
        let totalMarks = null;
        if (caMarks !== undefined && examMarks !== undefined) {
            totalMarks = caMarks + examMarks;
            if (totalMarks > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Total marks cannot exceed 100',
                });
            }
        }

        // Validate grade if provided
        if (grade && grade.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Grade cannot exceed 5 characters',
            });
        }

        // Check if a marks document exists for the student and unit
        let existingMarks = await Marks.findOne({ studentId, unit });

        if (existingMarks) {
            return res.status(400).json({
                success: false,
                message: 'Marks already exist for this student and unit',
            });
        }

        // Create new document
        const marks = new Marks({
            studentId,
            courseId: courseId || null,
            unit,
            caMarks: caMarks !== undefined ? caMarks : null,
            examMarks: examMarks !== undefined ? examMarks : null,
            totalMarks,
            grade: grade || null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        await marks.save();

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
            .populate('studentId', 'name email studentId')
            .populate('courseId', 'name')
            .populate('unit', 'name')
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
        const marks = await Marks.find({ studentId })
            .populate('studentId', 'name email studentId')
            .populate('courseId', 'name')
            .populate('unit', 'title')
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
        const marks = await Marks.findById(req.params.id)
            .populate('studentId', 'name email studentId')
            .populate('courseId', 'name')
            .populate('unit', 'name');

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
        const { studentId, courseId, unit, caMarks, examMarks, grade } = req.body;

        // Validate student if provided
        if (studentId) {
            if (!mongoose.Types.ObjectId.isValid(studentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid student ID',
                });
            }
            const studentExists = await Student.findById(studentId);
            if (!studentExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found',
                });
            }
        }

        // Validate unit if provided
        if (unit) {
            if (!mongoose.Types.ObjectId.isValid(unit)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid unit ID',
                });
            }
            const unitExists = await Unit.findById(unit);
            if (!unitExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Unit not found',
                });
            }
        }

        // Validate course if provided
        if (courseId) {
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid course ID',
                });
            }
            const courseExists = await Course.findById(courseId);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found',
                });
            }
        }

        // Fetch existing marks document
        const existingMarks = await Marks.findById(req.params.id);
        if (!existingMarks) {
            return res.status(404).json({
                success: false,
                message: 'Marks not found',
            });
        }

        // Validate marks if provided
        if ((caMarks !== undefined && (caMarks < 0 || caMarks > 100)) || 
            (examMarks !== undefined && (examMarks < 0 || examMarks > 100))) {
            return res.status(400).json({
                success: false,
                message: 'caMarks and examMarks must be between 0 and 100',
            });
        }

        // Calculate new totalMarks
        let totalMarks = existingMarks.totalMarks || null;
        if (caMarks !== undefined && examMarks !== undefined) {
            totalMarks = caMarks + examMarks;
            if (totalMarks > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Total marks cannot exceed 100',
                });
            }
        } else if (caMarks !== undefined && existingMarks.examMarks !== null) {
            totalMarks = caMarks + existingMarks.examMarks;
            if (totalMarks > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Total marks cannot exceed 100',
                });
            }
        } else if (examMarks !== undefined && existingMarks.caMarks !== null) {
            totalMarks = existingMarks.caMarks + examMarks;
            if (totalMarks > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Total marks cannot exceed 100',
                });
            }
        }

        // Validate grade if provided
        if (grade && grade.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Grade cannot exceed 5 characters',
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
            ...(studentId && { studentId }),
            ...(courseId !== undefined && { courseId: courseId || null }),
            ...(unit && { unit }),
            ...(caMarks !== undefined && { caMarks }),
            ...(examMarks !== undefined && { examMarks }),
            ...(totalMarks !== null && { totalMarks }),
            ...(grade !== undefined && { grade: grade || null }),
            updatedAt: Date.now(),
        };

        // Update marks
        const marks = await Marks.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('studentId', 'name email studentId')
         .populate('courseId', 'name')
         .populate('unit', 'name');

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