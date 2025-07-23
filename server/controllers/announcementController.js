const Announcement = require('../models/Announcements');
const asyncHandler = require('express-async-handler');

// Create a new announcement
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, description, course } = req.body;
    console.log(req);
    if (!title || !description || !course) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const announcement = await Announcement.create({
        title,
        description,
        course,
        Instructor: req.body.Instructor,
        date: new Date()
    });

    res.status(201).json({
        success: true,
        data: announcement
    });
});

// Get all announcements (SuperAdmin only)
const getAnnouncement = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find()
        .populate('Instructor', 'name')
        .populate('course', 'title');

    res.status(200).json({
        success: true,
        data: announcements
    });
});

// Get announcements by course ID
const getAnnouncementByCourseId = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find({ course: req.params.id })
        .populate('Instructor', 'name')
        .populate('course', 'title');

    res.status(200).json({
        success: true,
        data: announcements
    });
});

// Update an announcement
const updateAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    // Check if user is authorized to update (either the creator or SuperAdmin)
    if (announcement.Instructor.toString() !== req.user._id.toString() &&
        req.user.role !== 'SuperAdmin') {
        res.status(403);
        throw new Error('Not authorized to update this announcement');
    }

    // Explicitly define fields to update, excluding Instructor
    const { title, description, course, date } = req.body;
    const updateFields = {
        ...(title && { title }),
        ...(description && { description }),
        ...(course && { course }),
        ...(date && { date: new Date(date) }),
        updatedAt: new Date()
    };

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
    ).populate('Instructor', 'name')
        .populate('course', 'title');

    if (!updatedAnnouncement) {
        res.status(404);
        throw new Error('Failed to update announcement');
    }

    res.status(200).json({
        success: true,
        data: updatedAnnouncement
    });
});

// Delete an announcement
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error('Announcement not found');
    }

    // Check if user is authorized to delete (either the creator or SuperAdmin)
    if (announcement.Instructor.toString() !== req.user._id.toString() &&
        req.user.role !== 'SuperAdmin') {
        res.status(403);
        throw new Error('Not authorized to delete this announcement');
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
    });
});

module.exports = {
    createAnnouncement,
    getAnnouncement,
    getAnnouncementByCourseId,
    updateAnnouncement,
    deleteAnnouncement
};