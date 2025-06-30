const OnlineSession = require('../models/onlineSession');
const Unit = require('../models/Unit');
const Instructor = require('../models/Instructor');
const mongoose = require('mongoose');

/**
 * Helper function to validate ObjectId
 * @param {string} id - MongoDB ObjectId
 * @returns {boolean} - Validity of ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper function to validate required fields
 * @param {Object} data - Request body data
 * @param {string[]} requiredFields 
 * @returns {string|null} - Error message if validation fails, null otherwise
 */
const validateRequiredFields = (data, requiredFields) => {
    for (const field of requiredFields) {
        if (!data[field]) {
            return `${field} is required`;
        }
    }
    return null;
};

/**
 * Create a new online session
 * @route POST /api/online-sessions
 * @access Instructor, SuperAdmin
 */
exports.createSession = async (req, res) => {
    try {
        // Log request body for debugging
        console.log('Create session request body:', JSON.stringify(req.body, null, 2));

        const { title, unit, instructor, link, date, description } = req.body;

        // Validate required fields
        const validationError = validateRequiredFields(req.body, ['title', 'unit', 'instructor', 'link', 'date']);
        if (validationError) {
            return res.status(400).json({ success: false, result: validationError });
        }

        // Validate ObjectIds
        if (!isValidObjectId(unit) || !isValidObjectId(instructor)) {
            return res.status(400).json({ success: false, result: 'Invalid unit or instructor ID' });
        }

        // Check if unit and instructor exist
        const [unitExists, instructorExists] = await Promise.all([
            Unit.findById(unit).lean(),
            Instructor.findById(instructor).lean(),
        ]);

        if (!unitExists) {
            return res.status(404).json({ success: false, result: 'Unit not found' });
        }
        if (!instructorExists) {
            return res.status(404).json({ success: false, result: 'Instructor not found' });
        }

        // Validate user authentication and role
        if (!['Instructor', 'SuperAdmin'].includes(req.user.role)) {
            return res.status(403).json({ success: false, result: 'Access denied' });
        }

        // If user is Instructor, ensure they can only create sessions for themselves
        if (req.user.role === 'Instructor' && instructor !== req.user._id.toString()) {
            return res.status(403).json({ success: false, result: 'Instructors can only create sessions for themselves' });
        }

        // Validate date
        if (isNaN(new Date(date).getTime())) {
            return res.status(400).json({ success: false, result: 'Invalid date format' });
        }

        // Create and save session
        const session = new OnlineSession({
            title,
            unit,
            instructor,
            link,
            date: new Date(date),
            description,
            createdBy: req.user._id,
        });

        await session.save();

        // Update unit with session reference
        await Unit.findByIdAndUpdate(unit, { $push: { sessions: session._id } });

        res.status(201).json({ success: true, data: session });
    } catch (error) {
        console.error('Create session error:', error);
        return res.status(500).json({ success: false, result: 'Error creating session', error: error.message });
    }
};

/**
 * Get all sessions with optional filters
 * @route GET /api/online-sessions
 * @access Instructor, SuperAdmin
 */
exports.getSession = async (req, res) => {
    try {
        const { unitId } = req.query;
        let query = {};

        // Apply filters
        if (unitId) {
            if (!isValidObjectId(unitId)) {
                return res.status(400).json({ success: false, result: 'Invalid unit ID' });
            }
            query.unit = unitId;
        }

        // Restrict to instructor's sessions
        if (req.user?.role === 'Instructor') {
            query.instructor = req.user._id;
        }

        const sessions = await OnlineSession.find(query)
            .populate('unit', 'title')
            .populate('instructor', 'name')
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ success: false, result: 'Error fetching sessions', error: error.message });
    }
};

/**
 * Get sessions by unit ID
 * @route GET /api/online-sessions/unitId/:id
 * @access Student, Instructor, SuperAdmin
 */
exports.getSessionByUnitId = async (req, res) => {
    try {
        const { id: unitId } = req.params;

        if (!isValidObjectId(unitId)) {
            return res.status(400).json({ success: false, result: 'Invalid unit ID' });
        }

        const unit = await Unit.findById(unitId).lean();
        if (!unit) {
            return res.status(404).json({ success: false, result: 'Unit not found' });
        }
        

        // Restrict to instructor's sessions
        let query = { unit: unitId };
        if (req.user?.role === 'Instructor') {
            query.instructor = req.user._id;
        }

        const sessions = await OnlineSession.find(query)
            .populate('unit', 'title')
            .populate('instructor', 'name')
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error('Get sessions by unit ID error:', error);
        return res.status(500).json({ success: false, result: 'Error fetching sessions', error: error.message });
    }
};

/**
 * Get session by ID
 * @route GET /api/online-sessions/:id
 * @access Instructor, SuperAdmin
 */
exports.getSessionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, result: 'Invalid session ID' });
        }

        const session = await OnlineSession.findById(id)
            .populate('unit', 'title')
            .populate('instructor', 'name')
            .lean();

        if (!session) {
            return res.status(404).json({ success: false, result: 'Session not found' });
        }

        // Restrict to instructor's session
        if (req.user?.role === 'Instructor' && session.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, result: 'Access denied' });
        }

        res.status(200).json({ success: true, data: session });
    } catch (error) {
        console.error('Get session by ID error:', error);
        return res.status(500).json({ success: false, result: 'Error fetching session', error: error.message });
    }
};

/**
 * Update session by ID
 * @route PUT /api/online-sessions/:id
 * @access Instructor, SuperAdmin
 */
exports.updateSession = async (req, res) => {
    try {
        // Log request body for debugging
        console.log('Update session request body:', JSON.stringify(req.body, null, 2));

        const { id } = req.params;
        const { title, unit, instructor, link, date, description } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, result: 'Invalid session ID' });
        }

        // Validate unit and instructor if provided
        if (unit && !isValidObjectId(unit)) {
            return res.status(400).json({ success: false, result: 'Invalid unit ID' });
        }
        if (instructor && !isValidObjectId(instructor)) {
            return res.status(400).json({ success: false, result: 'Invalid instructor ID' });
        }

        if (unit) {
            const unitExists = await Unit.findById(unit).lean();
            if (!unitExists) {
                return res.status(404).json({ success: false, result: 'Unit not found' });
            }
        }

        if (instructor) {
            const instructorExists = await Instructor.findById(instructor).lean();
            if (!instructorExists) {
                return res.status(404).json({ success: false, result: 'Instructor not found' });
            }
        }

        // Validate date if provided
        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({ success: false, result: 'Invalid date format' });
        }

        const session = await OnlineSession.findById(id);
        if (!session) {
            return res.status(404).json({ success: false, result: 'Session not found' });
        }

        // Restrict to instructor's session
        if (req.user?.role === 'Instructor' && session.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, result: 'Access denied' });
        }

        // If updating instructor, ensure Instructor role can't set other instructors
        if (instructor && req.user.role === 'Instructor' && instructor !== req.user._id.toString()) {
            return res.status(403).json({ success: false, result: 'Instructors can only update their own sessions' });
        }

        // Build update data
        const updateData = {
            ...(title && { title }),
            ...(unit && { unit }),
            ...(instructor && { instructor }),
            ...(link && { link }),
            ...(date && { date: new Date(date) }),
            ...(description && { description }),
            updatedAt: Date.now(),
        };

        // Update unit references if unit changes
        if (unit && unit !== session.unit.toString()) {
            await Unit.findByIdAndUpdate(session.unit, { $pull: { sessions: session._id } });
            await Unit.findByIdAndUpdate(unit, { $push: { sessions: session._id } });
        }

        // Update session
        const updatedSession = await OnlineSession.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('unit', 'title')
            .populate('instructor', 'name');

        res.status(200).json({ success: true, data: updatedSession });
    } catch (error) {
        console.error('Update session error:', error);
        return res.status(500).json({ success: false, result: 'Error updating session', error: error.message });
    }
};

/**
 * Delete session by ID
 * @route DELETE /api/online-sessions/:id
 * @access Instructor, SuperAdmin
 */
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, result: 'Invalid session ID' });
        }

        const session = await OnlineSession.findById(id);
        if (!session) {
            return res.status(404).json({ success: false, result: 'Session not found' });
        }

        // Restrict to instructor's session
        if (req.user?.role === 'Instructor' && session.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, result: 'Access denied' });
        }

        // Remove session reference from unit
        await Unit.findByIdAndUpdate(session.unit, { $pull: { sessions: session._id } });

        await session.deleteOne();

        res.status(200).json({ success: true, result: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        return res.status(500).json({ success: false, result: 'Error deleting session', error: error.message });
    }
};