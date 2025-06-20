const CalendarEvent = require('../models/CalendarEvent');
const mongoose = require('mongoose');

exports.createCalendarEvent = async (req, res) => {
  try {
    const { title, description, date, type, relatedId, relatedType, recipients, recipientType } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ success: false, message: 'Title, date, and type are required' });
    }

    if (!['exam', 'assessment', 'event', 'class'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid event type' });
    }

    if (relatedType && !['Exam', 'Assessment', 'Course'].includes(relatedType)) {
      return res.status(400).json({ success: false, message: 'Invalid relatedType' });
    }

    if (recipientType && !['Student', 'Instructor'].includes(recipientType)) {
      return res.status(400).json({ success: false, message: 'Invalid recipientType' });
    }

    if (relatedId && !mongoose.Types.ObjectId.isValid(relatedId)) {
      return res.status(400).json({ success: false, message: 'Invalid relatedId' });
    }

    if (recipients && !Array.isArray(recipients)) {
      return res.status(400).json({ success: false, message: 'Recipients must be an array' });
    }
    if (recipients && recipients.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID in recipients array' });
    }

    if (!['Instructor', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only Instructors and SuperAdmins can create calendar events' });
    }

    const calendarEvent = new CalendarEvent({
      title,
      description,
      date,
      type,
      relatedId,
      relatedType,
      recipients,
      recipientType,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    await calendarEvent.save();

    res.status(201).json({ success: true, data: calendarEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating calendar event', error: error.message });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const { type, relatedId, recipientId } = req.query;
    let query = {};

    if (req.user.role === 'Student') {
      query.recipients = req.user.id;
    }

    if (type) {
      if (!['exam', 'assessment', 'event', 'class'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid event type' });
      }
      query.type = type;
    }

    if (relatedId) {
      if (!mongoose.Types.ObjectId.isValid(relatedId)) {
        return res.status(400).json({ success: false, message: 'Invalid relatedId' });
      }
      query.relatedId = relatedId;
    }

    if (recipientId) {
      if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ success: false, message: 'Invalid recipientId' });
      }
      query.recipients = recipientId;
    }

    const calendarEvents = await CalendarEvent.find(query)
      .populate('relatedId', 'title')
      .populate('recipients', 'name')
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: calendarEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching calendar events', error: error.message });
  }
};

exports.getCalendarEventById = async (req, res) => {
  try {
    const calendarEvent = await CalendarEvent.findById(req.params.id)
      .populate('relatedId', 'title')
      .populate('recipients', 'name');

    if (!calendarEvent) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    if (req.user.role === 'Student' && !calendarEvent.recipients.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: calendarEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching calendar event', error: error.message });
  }
};

exports.updateCalendarEvent = async (req, res) => {
  try {
    const { title, description, date, type, relatedId, relatedType, recipients, recipientType } = req.body;

    if (!['Instructor', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only Instructors and SuperAdmins can update calendar events' });
    }

    if (type && !['exam', 'assessment', 'event', 'class'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid event type' });
    }

    if (relatedType && !['Exam', 'Assessment', 'Course'].includes(relatedType)) {
      return res.status(400).json({ success: false, message: 'Invalid relatedType' });
    }

    if (recipientType && !['Student', 'Instructor'].includes(recipientType)) {
      return res.status(400).json({ success: false, message: 'Invalid recipientType' });
    }

    if (relatedId && !mongoose.Types.ObjectId.isValid(relatedId)) {
      return res.status(400).json({ success: false, message: 'Invalid relatedId' });
    }

    if (recipients && !Array.isArray(recipients)) {
      return res.status(400).json({ success: false, message: 'Recipients must be an array' });
    }
    if (recipients && recipients.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID in recipients array' });
    }

    const calendarEvent = await CalendarEvent.findById(req.params.id);
    if (!calendarEvent) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(date && { date }),
      ...(type && { type }),
      ...(relatedId && { relatedId }),
      ...(relatedType && { relatedType }),
      ...(recipients && { recipients }),
      ...(recipientType && { recipientType }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const updatedCalendarEvent = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('relatedId', 'title')
      .populate('recipients', 'name');

    res.status(200).json({ success: true, data: updatedCalendarEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating calendar event', error: error.message });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    if (!['Instructor', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only Instructors and SuperAdmins can delete calendar events' });
    }

    const calendarEvent = await CalendarEvent.findById(req.params.id);

    if (!calendarEvent) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    await calendarEvent.deleteOne();

    res.status(200).json({ success: true, message: 'Calendar event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting calendar event', error: error.message });
  }
};