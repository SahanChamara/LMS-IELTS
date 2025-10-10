const Discussion = require("../models/Discussion");
const Unit = require("../models/Unit");
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const mongoose = require("mongoose");
const HttpsStatus = require("../config/statusCode");

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const validateObjectId = (id, name = 'ID') => {
    if (!id && !mongoose.isValidObjectId(id)) {
        throw new ApiError(400, `Invalid ${name}`);
    }
}

const validateRequiredFields = (fields, data) => {
    for (const field of fields) {
        if (data[field] === undefined || data[field] === null) {
            throw new ApiError(400, `${field} is required`);
        }
    }
};

exports.addChat = async (req, res) => {
    try {
        const {unitId, newMessage} = req.body;
        const senderId = req.user.id;
        const role = req.user.role;

        validateRequiredFields(['unitId', 'newMessage'], {unitId, newMessage});
        validateObjectId(unitId, 'unit ID');

        if (role !== "Student") {
            throw new ApiError(403, 'Only Student can Send Message');
        }

        const unit = await Unit.findById(unitId).select('instructor');
        if (!unit) throw new ApiError(404, 'Unit not found');
        if (!unit.instructor) throw new ApiError(400, 'No instructor assigned to this unit');

        let discussion = await Discussion.findOne({student: senderId, instructor: unit.instructor, unit: unitId});
        if (!discussion) {
            discussion = new Discussion({
                student: senderId,
                instructor: unit.instructor,
                unit: unitId,
                content: []
            });
        }

        discussion.content.push({user: role, msg: newMessage, timestamp: Date.now()});
        discussion.updatedAt = Date.now();
        await discussion.save();

        return res.status(HttpsStatus.CREATED).json({
            success: true,
            newMessage: "Message Send Successfully",
            data: {discussionId: discussion._id}
        });
    } catch (error) {
        return res.status(error.statusCode || HttpsStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            error: error.message
        });

    }
};

// (only the getMessageByUnit function changed)
exports.getMessageByUnit = async (req, res) => {
    try {
        const { unitId } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        validateObjectId(unitId, 'unit ID');

        if (role === 'Student') {
            // Student -> return the single discussion between student and the instructor for that unit
            const discussion = await Discussion.findOne({ student: userId, unit: unitId, instructor: { $exists: true } })
                .populate('instructor', 'name email')
                .lean();
            if (!discussion) throw new ApiError(404, 'No discussion found');

            // Map content items into message objects
            const messages = discussion.content.map(c => ({
                discussionId: discussion._id,
                senderId: discussion.student, // student's id
                senderName: discussion.student.name || '', // may be populated only if student populated
                user: c.user,
                msg: c.msg,
                timestamp: c.timestamp
            }));

            return res.status(HttpsStatus.OK).json({ success: true, data: messages });
        } else if (role === 'Instructor') {
            // Instructor -> return all discussions for this unit where instructor is the current user
            // We return the discussion objects (id, student, content) so frontend knows discussion ids and student info
            const unit = await Unit.findOne({ _id: unitId, instructor: userId });
            if (!unit) throw new ApiError(404, 'Unit not found or access denied');

            const discussions = await Discussion.find({ unit: unitId, instructor: userId })
                .populate('student', 'name email') // include student info
                .lean();

            // Normalize response: return array of discussion objects including _id, student (with name/email), content array
            // Each discussion.content item has { user, msg, timestamp, ... }
            return res.status(HttpsStatus.OK).json({
                success: true,
                data: discussions.map(d => ({
                    discussionId: d._id,
                    student: d.student ? { _id: d.student._id, name: d.student.name, email: d.student.email } : null,
                    content: d.content || [],
                    updatedAt: d.updatedAt
                }))
            });
        } else {
            throw new ApiError(403, 'Unauthorized role');
        }
    } catch (error) {
        return res.status(error.statusCode || HttpsStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};


exports.replyToMessage = async (req, res) => {
    try {
        const {discussionId, reply} = req.body;
        const instructorId = req.user.id;
        const role = req.user.role;

        validateRequiredFields(['discussionId', 'reply'], {discussionId, reply});
        validateObjectId(discussionId, 'discussion ID');

        if (role !== 'Instructor') {
            throw new ApiError(403, 'Only instructors can reply to messages');
        }

        const discussion = await Discussion.findOne({_id: discussionId, instructor: instructorId});
        if (!discussion) throw new ApiError(404, 'Discussion not found or access denied');

        discussion.content.push({user: role, msg: reply});
        discussion.updatedAt = Date.now();
        await discussion.save();

        return res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            data: {discussionId: discussion._id}
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};