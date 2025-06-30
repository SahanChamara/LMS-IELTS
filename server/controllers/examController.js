const Exam = require('../models/Exam');
const Unit = require('../models/Unit');
const Course = require('../models/Course');
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
 * @param {string[]} requiredFields - Array of required field names
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
 * Helper function to check if unit belongs to course
 * @param {string} unitId - Unit ObjectId
 * @param {string} courseId - Course ObjectId
 * @returns {Promise<boolean>} - True if unit belongs to course
 */
const validateUnitCourseRelation = async (unitId, courseId) => {
  const unit = await Unit.findById(unitId).select('course');
  return unit && unit.course.toString() === courseId;
};

/**
 * Create a new exam
 * @route POST /api/exams
 * @access Instructor, SuperGrok
 */
exports.createExam = async (req, res) => {
  try {
    const { title, unit, course: courseId, description, date, duration, location, lessons, maxScore } = req.body;

    // Validate required fields
    const validationError = validateRequiredFields(req.body, ['title', 'unit', 'course', 'duration', 'maxScore']);
    if (validationError) {
      return res.status(400).json({ success: false, result: validationError });
    }

    // Validate ObjectIds
    if (!isValidObjectId(unit) || !isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, result: 'Invalid unit or course ID' });
    }

    // Check if unit and course exist
    const [unitExists, courseExists] = await Promise.all([
      Unit.findById(unit).lean(),
      Course.findById(courseId).lean(),
    ]);

    if (!unitExists) {
      return res.status(404).json({ success: false, result: 'Unit not found' });
    }
    if (!courseExists) {
      return res.status(404).json({ success: false, result: 'Course not found' });
    }

    // Validate unit-course relationship
    if (!(await validateUnitCourseRelation(unit, courseId))) {
      return res.status(400).json({ success: false, result: 'Unit does not belong to the specified course' });
    }

    // Validate lessons if provided
    if (lessons && (!Array.isArray(lessons) || lessons.some(l => typeof l !== 'string'))) {
      return res.status(400).json({ success: false, result: 'Invalid lessons format' });
    }

    // Validate user authentication
    if (!req.user?._id) {
      return res.status(401).json({ success: false, result: 'User not authenticated' });
    }

    // Create and save exam
    const exam = new Exam({
      title,
      unit,
      course: courseId,
      description,
      date,
      location,
      lessons: lessons || [],
      duration,
      maxScore,
      createdBy: req.user._id,
    });

    await exam.save();

    // Update unit with exam reference
    await Unit.findByIdAndUpdate(unit, { $push: { exams: exam._id } });

    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    console.error('Create exam error:', error);
    return res.status(500).json({ success: false, result: 'Error creating exam', error: error.message });
  }
};

/**
 * Get all exams with optional filters
 * @route GET /api/exams
 * @access Student, Instructor, SuperGrok
 */
exports.getExams = async (req, res) => {
  try {
    const { unitId, courseId } = req.query;
    let query = {};

    // Apply filters
    if (unitId) {
      if (!isValidObjectId(unitId)) {
        return res.status(400).json({ success: false, result: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    if (courseId) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ success: false, result: 'Invalid course ID' });
      }
      query.course = courseId;
    }

    // Role-based filtering
    if (req.user?.role === 'Student') {
      if (!req.user.enrolledCourses || !Array.isArray(req.user.enrolledCourses)) {
        return res.status(403).json({ success: false, result: 'No enrolled courses found' });
      }
      query.course = { $in: req.user.enrolledCourses };
    }

    const exams = await Exam.find(query)
        .populate('unit', 'title')
        .populate('course', 'title')
        .sort({ createdAt: 1 })
        .lean();

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error('Get exams error:', error);
    return res.status(500).json({ success: false, result: 'Error fetching exams', error: error.message });
  }
};

/**
 * Get exams by unit ID
 * @route GET /api/exams/unitId/:id
 * @access Student, Instructor, SuperGrok
 */
exports.getExamByUnitId = async (req, res) => {
  try {
    const { id: unitId } = req.params;

    if (!isValidObjectId(unitId)) {
      return res.status(400).json({ success: false, result: 'Invalid unit ID' });
    }

    const unit = await Unit.findById(unitId).lean();
    if (!unit) {
      return res.status(404).json({ success: false, result: 'Unit not found' });
    }


    const exams = await Exam.find({ unit: unitId })
        .populate('unit', 'title')
        .populate('course', 'title')
        .sort({ createdAt: 1 })
        .lean();

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error('Get exams by unit ID error:', error);
    return res.status(500).json({ success: false, result: 'Error fetching exams', error: error.message });
  }
};

/**
 * Get exam by ID
 * @route GET /api/exams/:id
 * @access Instructor, SuperGrok
 */
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, result: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(id)
        .populate('unit', 'title')
        .populate('course', 'title')
        .lean();

    if (!exam) {
      return res.status(404).json({ success: false, result: 'Exam not found' });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error('Get exam by ID error:', error);
    return res.status(500).json({ success: false, result: 'Error fetching exam', error: error.message });
  }
};

/**
 * Update exam by ID
 * @route PUT /api/exams/:id
 * @access Instructor, SuperGrok
 */
exports.updateExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, unit, course: courseId, description, date, location, duration, lessons, maxScore } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, result: 'Invalid exam ID' });
    }

    // Validate unit and course if provided
    if (unit && !isValidObjectId(unit)) {
      return res.status(400).json({ success: false, result: 'Invalid unit ID' });
    }
    if (courseId && !isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, result: 'Invalid course ID' });
    }

    if (unit) {
      const unitExists = await Unit.findById(unit).lean();
      if (!unitExists) {
        return res.status(404).json({ success: false, result: 'Unit not found' });
      }
    }

    if (courseId) {
      const courseExists = await Course.findById(courseId).lean();
      if (!courseExists) {
        return res.status(404).json({ success: false, result: 'Course not found' });
      }
    }

    if (unit && courseId) {
      if (!(await validateUnitCourseRelation(unit, courseId))) {
        return res.status(400).json({ success: false, result: 'Unit does not belong to the specified course' });
      }
    }

    // Validate lessons if provided
    if (lessons && (!Array.isArray(lessons) || lessons.some(l => typeof l !== 'string'))) {
      return res.status(400).json({ success: false, result: 'Invalid lessons format' });
    }

    // Build update data
    const updateData = {
      ...(title && { title }),
      ...(unit && { unit }),
      ...(courseId && { course: courseId }),
      ...(description && { description }),
      ...(date && { date }),
      ...(location && { location }),
      ...(duration && { duration }),
      ...(lessons && { lessons }),
      ...(maxScore && { maxScore }),
      updatedAt: Date.now(),
    };

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ success: false, result: 'Exam not found' });
    }

    // Update unit references if unit changes
    if (unit && unit !== exam.unit.toString()) {
      await Unit.findByIdAndUpdate(exam.unit, { $pull: { exams: exam._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { exams: exam._id } });
    }

    // Update exam
    const updatedExam = await Exam.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('unit', 'title')
        .populate('course', 'title');

    res.status(200).json({ success: true, data: updatedExam });
  } catch (error) {
    console.error('Update exam error:', error);
    return res.status(500).json({ success: false, result: 'Error updating exam', error: error.message });
  }
};

/**
 * Delete exam by ID
 * @route DELETE /api/exams/:id
 * @access Instructor, SuperGrok
 */
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, result: 'Invalid exam ID' });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ success: false, result: 'Exam not found' });
    }

    // Remove exam reference from unit
    await Unit.findByIdAndUpdate(exam.unit, { $pull: { exams: exam._id } });

    await exam.deleteOne();

    res.status(200).json({ success: true, result: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    return res.status(500).json({ success: false, result: 'Error deleting exam', error: error.message });
  }
};