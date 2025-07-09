const Instructor = require('../models/Instructor');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Unit } = require('../models');

exports.createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Instructor with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = new Instructor({
      name,
      email,
      password: hashedPassword
    });

    await instructor.save();
    res.status(201).json({ message: 'Instructor created successfully', instructor: { id: instructor._id, name, email, role: 'Instructor' } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating instructor', error: error.message });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find()
      .populate('courses', 'title description')
      .populate('notifications', 'message createdAt')
      .populate('calendarEvents', 'title date')
      .select('-password');
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructors', error: error.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .populate('courses', 'title description')
      .populate('notifications', 'message createdAt')
      .populate('calendarEvents', 'title date')
      .select('-password');
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructor', error: error.message });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { 
      name: name || undefined, 
      email: email || undefined, 
      updatedAt: Date.now() 
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(instructor, updateData);
    await instructor.save();

    res.status(200).json({ 
      message: 'Instructor updated successfully', 
      instructor: { 
        id: instructor._id, 
        name: instructor.name, 
        email: instructor.email, 
        role: 'Instructor' 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating instructor', error: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting instructor', error: error.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { courseId } = req.body;
    if (!instructor.courses.includes(courseId)) {
      instructor.courses.push(courseId);
      await instructor.save();
    }

    res.status(200).json({ message: 'Course added to instructor', instructor: instructor.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { notificationId } = req.body;
    if (!instructor.notifications.includes(notificationId)) {
      instructor.notifications.push(notificationId);
      await instructor.save();
    }

    res.status(200).json({ message: 'Notification added to instructor', instructor: instructor.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding notification', error: error.message });
  }
};

exports.addCalendarEvent = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    if (req.user.role !== 'SuperAdmin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { eventId } = req.body;
    if (!instructor.calendarEvents.includes(eventId)) {
      instructor.calendarEvents.push(eventId);
      await instructor.save();
    }

    res.status(200).json({ message: 'Calendar event added to instructor', instructor: instructor.toObject({ getters: true }) });
  } catch (error) {
    res.status(500).json({ message: 'Error adding calendar event', error: error.message });
  }
};