const AssessmentMarks = require('../models/AssessmentMarks');
const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Assessment = require('../models/Assessment');
const mongoose = require('mongoose');

// Create a new assessment mark
exports.createMark = async (req, res) => {
    try {
        const { student, assessment, maxMarks, weight, marks } = req.body;

        // Validate required fields
        if (!student || !assessment || maxMarks === undefined || weight === undefined || marks === undefined) {
            return res.status(400).json({
                success: false,
                message: 'student, assessment, maxMarks, weight, and marks are required',
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

        // Validate assessment ID
        if (!mongoose.Types.ObjectId.isValid(assessment)) {
            return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
        }
        const assessmentExists = await Assessment.findById(assessment);
        if (!assessmentExists) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        // Validate numeric fields
        if (maxMarks <= 0 || weight < 0 || marks < 0) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks must be greater than 0, weight and marks cannot be negative',
            });
        }
        if (marks > maxMarks) {
            return res.status(400).json({
                success: false,
                message: 'marks cannot exceed maxMarks',
            });
        }

        // Calculate weighted marks
        const weightedMarks = ((marks/maxMarks) * 100) / weight;


        // Create assessment marks document
        const assessmentMark = new AssessmentMarks({
            student,
            assessment,
            maxMarks,
            weight,
            marks,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Save assessment marks
        await assessmentMark.save();

        // Update Marks collection
        let marksDoc = await Marks.findOne({ student });
        if (marksDoc) {
            // Update existing Marks document
            marksDoc.caMarks = (marksDoc.caMarks || 0) + weightedMarks;
            marksDoc.totalMarks = (marksDoc.totalMarks || 0) + weightedMarks;
            marksDoc.maxMarks = (marksDoc.maxMarks || 0) + weight;
            marksDoc.updatedAt = Date.now();
            await marksDoc.save();
        } else {
            // Create new Marks document
            marksDoc = new Marks({
                caMarks: weightedMarks,
                totalMarks: weightedMarks,
                maxMarks: Math.max(maxMarks, assessmentExists.totalMarks || 100), // Use reasonable default
                student,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            await marksDoc.save();
        }

        res.status(201).json({ success: true, data: assessmentMark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating assessment mark',
            error: error.message,
        });
    }
};

// Get all assessment marks
exports.getMark = async (req, res) => {
    try {
        const marks = await AssessmentMarks.find()
            .populate('student', 'name email studentId')
            .populate('assessment', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment marks',
            error: error.message,
        });
    }
};

// Get assessment marks by student ID
exports.getMarkByStudentId = async (req, res) => {
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
        const marks = await AssessmentMarks.find({ student: studentId })
            .populate('student', 'name email studentId')
            .populate('assessment', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment marks by student',
            error: error.message,
        });
    }
};

// Get a single assessment mark by ID
exports.getMarkById = async (req, res) => {
    try {
        const mark = await AssessmentMarks.findById(req.params.id)
            .populate('student', 'name email studentId')
            .populate('assessment', 'title');

        if (!mark) {
            return res.status(404).json({ success: false, message: 'Assessment mark not found' });
        }

        res.status(200).json({ success: true, data: mark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assessment mark',
            error: error.message,
        });
    }
};

// Update an assessment mark
exports.updateMark = async (req, res) => {
    try {
        const { student, assessment, maxMarks, weight, marks } = req.body;

        // Fetch existing assessment mark
        const existingMark = await AssessmentMarks.findById(req.params.id);
        if (!existingMark) {
            return res.status(404).json({ success: false, message: 'Assessment mark not found' });
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

        // Validate assessment if provided
        if (assessment) {
            if (!mongoose.Types.ObjectId.isValid(assessment)) {
                return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
            }
            const assessmentExists = await Assessment.findById(assessment);
            if (!assessmentExists) {
                return res.status(404).json({ success: false, message: 'Assessment not found' });
            }
        }

        // Validate numeric fields if provided
        if ((maxMarks !== undefined && maxMarks <= 0) || (weight !== undefined && weight < 0) || (marks !== undefined && marks < 0)) {
            return res.status(400).json({
                success: false,
                message: 'maxMarks must be greater than 0, weight and marks cannot be negative',
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

        // Calculate old and new weighted marks
        const oldWeightedMarks = (existingMark.marks * existingMark.weight) / 100;
        const newWeightedMarks = marks !== undefined && weight !== undefined
            ? (marks * weight) / 100
            : marks !== undefined
                ? (marks * existingMark.weight) / 100
                : weight !== undefined
                    ? (existingMark.marks * weight) / 100
                    : oldWeightedMarks;

        // Update Marks collection
        let marksDoc = await Marks.findOne({ student: student || existingMark.student });
        if (!marksDoc) {
            // Create new Marks document if none exists
            marksDoc = new Marks({
                caMarks: newWeightedMarks,
                totalMarks: newWeightedMarks,
                maxMarks: maxMarks !== undefined ? maxMarks : existingMark.maxMarks,
                student: student || existingMark.student,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        } else {
            // Adjust caMarks and totalMarks
            marksDoc.caMarks = (marksDoc.caMarks || 0) - oldWeightedMarks + newWeightedMarks;
            marksDoc.totalMarks = (marksDoc.totalMarks || 0) - oldWeightedMarks + newWeightedMarks;
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

        // Prepare update data for AssessmentMarks
        const updateData = {
            ...(student && { student }),
            ...(assessment && { assessment }),
            ...(maxMarks !== undefined && { maxMarks }),
            ...(weight !== undefined && { weight }),
            ...(marks !== undefined && { marks }),
            updatedAt: Date.now(),
        };

        // Update assessment mark
        const updatedMark = await AssessmentMarks.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedMark });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating assessment mark',
            error: error.message,
        });
    }
};

// Delete an assessment mark
exports.deleteMark = async (req, res) => {
    try {
        const mark = await AssessmentMarks.findById(req.params.id);
        if (!mark) {
            return res.status(404).json({ success: false, message: 'Assessment mark not found' });
        }

        // Calculate weighted marks to remove
        const weightedMarks = (mark.marks * mark.weight) / 100;

        // Update Marks collection
        const marksDoc = await Marks.findOne({ student: mark.student });
        if (marksDoc) {
            marksDoc.caMarks = Math.max(0, (marksDoc.caMarks || 0) - weightedMarks);
            marksDoc.totalMarks = Math.max(0, (marksDoc.totalMarks || 0) - weightedMarks);
            marksDoc.updatedAt = Date.now();
            await marksDoc.save();
        }

        // Delete assessment mark
        await mark.deleteOne();

        res.status(200).json({ success: true, message: 'Assessment mark deleted successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting assessment mark',
            error: error.message,
        });
    }
};