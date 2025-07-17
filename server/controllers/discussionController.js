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

exports.getMessageByUnit = async (req, res) => {
    try {
        const {unitId} = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        validateObjectId(unitId, 'unit ID');

        if (role === 'Student') {
            const discussion = await Discussion.findOne({student: userId, unit: unitId, instructor: {$exists: true}})
                .populate('instructor', 'name email')
                .lean();
            if (!discussion) throw new ApiError(404, 'No discussion found');

            const messages = discussion.content.map(c => ({
                senderId: discussion.student._id,
                senderName: discussion.student.name,
                user: c.user,
                msg: c.msg,
                timestamp: c.timestamp
            }));
            return res.status(HttpsStatus.OK).json({success: true, data: messages});
        } else if (role === 'Instructor') {
            const unit = await Unit.findOne({_id: unitId, instructor: userId});
            if (!unit) throw new ApiError(404, 'Unit not found or access denied');

            const discussions = await Discussion.find({unit: unitId, instructor: userId})
                .populate('student', 'name email')
                .lean();

            const messages = discussions.flatMap(d => d.content.map(c => ({
                senderId: d.instructor._id,
                senderName: d.instructor.name,
                user: c.user,
                msg: c.msg,
                timestamp: c.date
            }))).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return res.status(HttpsStatus.OK).json({success: true, data: messages});
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