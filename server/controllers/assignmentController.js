const Assignment = require('../models/Assignment');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

// Create a new assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, unit, passPercentage, totalMarks, file, description, status, dueDate } = req.body;
        console.log(req.body);
        // Validate required fields
        if (title === undefined || unit === undefined || passPercentage === undefined || totalMarks === undefined || file === undefined) {
            return res.status(400).json({
                success: false,
                message: 'title, unit, passPercentage, totalMarks, and file are required',
            });
        }

        // Validate unit exists
        if (!mongoose.Types.ObjectId.isValid(unit)) {
            return res.status(400).json({ success: false, message: 'Invalid unit ID' });
        }
        const unitExists = await Unit.findById(unit);
        if (!unitExists) {
            return res.status(404).json({ success: false, message: 'Unit not found' });
        }

        // Validate status if provided
        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "active" or "inactive"',
            });
        }

        // Validate numeric fields
        if (passPercentage < 0 || totalMarks <= 0) {
            return res.status(400).json({
                success: false,
                message: 'passPercentage cannot be negative, totalMarks must be greater than 0',
            });
        }

        const assignmentData = {
            title,
            unit,
            passPercentage,
            totalMarks,
            file,
            ...(description && { description }),
            ...(status && { status }),
            ...(dueDate && { dueDate }),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const assignment = new Assignment(assignmentData);
        await assignment.save();

        // Add assignment to unit's assignments array
        await Unit.findByIdAndUpdate(unit, { $push: { assignments: assignment._id } });

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating assignment',
            error: error.message,
        });
    }
};

// Get all assignments
exports.getAssignments = async (req, res) => {
    try {
        const { unitId } = req.query;
        let query = {};

        if (unitId) {
            if (!mongoose.Types.ObjectId.isValid(unitId)) {
                return res.status(400).json({ success: false, message: 'Invalid unit ID' });
            }
            query.unit = unitId;
        }

        const assignments = await Assignment.find(query)
            .populate('unit', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: assignments, message: "All Assignment Fetch Successfull" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments',
            error: error.message,
        });
    }
};

// Get assignments by unit ID
exports.getAssignmentsByUnitId = async (req, res) => {
    try {
        const { id: unitId } = req.params;

        // Validate unit ID
        if (!mongoose.Types.ObjectId.isValid(unitId)) {
            return res.status(400).json({ success: false, message: 'Invalid unit ID' });
        }

        // Verify unit exists
        const unitExists = await Unit.findById(unitId);
        if (!unitExists) {
            return res.status(404).json({ success: false, message: 'Unit not found' });
        }

        const assignments = await Assignment.find({ unit: unitId })
            .populate('unit', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments by unit',
            error: error.message,
        });
    }
};

// Get a single assignment by ID
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('unit', 'title');

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching assignment',
            error: error.message,
        });
    }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
    try {
        const { title, unit, passPercentage, totalMarks, file, description, status, dueDate } = req.body;

        // Validate unit if provided
        if (unit) {
            if (!mongoose.Types.ObjectId.isValid(unit)) {
                return res.status(400).json({ success: false, message: 'Invalid unit ID' });
            }
            const unitExists = await Unit.findById(unit);
            if (!unitExists) {
                return res.status(404).json({ success: false, message: 'Unit not found' });
            }
        }

        // Validate status if provided
        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "active" or "inactive"',
            });
        }

        // Validate numeric fields if provided
        if ((passPercentage !== undefined && passPercentage < 0) || (totalMarks !== undefined && totalMarks <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'passPercentage cannot be negative, totalMarks must be greater than 0',
            });
        }

        // Ensure at least one field is provided for update
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update',
            });
        }

        const updateData = {
            ...(title && { title }),
            ...(unit && { unit }),
            ...(passPercentage !== undefined && { passPercentage }),
            ...(totalMarks !== undefined && { totalMarks }),
            ...(file && { file }),
            ...(description && { description }),
            ...(status && { status }),
            ...(dueDate && { dueDate }),
            updatedAt: Date.now(),
        };

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Update unit references if unit has changed
        if (unit && unit !== assignment.unit.toString()) {
            await Unit.findByIdAndUpdate(assignment.unit, { $pull: { assignments: assignment._id } });
            await Unit.findByIdAndUpdate(unit, { $push: { assignments: assignment._id } });
        }

        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating assignment',
            error: error.message,
        });
    }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Remove assignment from unit's assignments array
        await Unit.findByIdAndUpdate(assignment.unit, { $pull: { assignments: assignment._id } });

        // Delete assignment
        await assignment.deleteOne();

        res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting assignment',
            error: error.message,
        });
    }
};