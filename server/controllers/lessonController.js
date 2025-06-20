const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Unit = require('../models/Unit');



class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const validateObjectId = (id, name = 'ID') => {
  if (id && !mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${name}`);
  }
};

const validateRequiredFields = (fields, data) => {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null) {
      throw new ApiError(400, `${field} is required`);
    }
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { title, unit, content, order, doc, lectureLink, duration, completed } = req.body;

    // Validate required fields
    validateRequiredFields(['title', 'unit', 'order'], { title, unit, order });
    validateObjectId(unit, 'unit ID');

    // Validate unit exists
    const unitExists = await Unit.findById(unit).lean();
    if (!unitExists) {
      throw new ApiError(404, 'Unit not found');
    }

    // Validate order uniqueness for the unit
    const orderExists = await Lesson.findOne({ unit, order }).lean();
    if (orderExists) {
      throw new ApiError(400, 'Order already exists for this unit');
    }

    // Validate optional fields
    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      throw new ApiError(400, 'Duration must be a positive number');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      throw new ApiError(400, 'Completed must be a boolean');
    }
    if (doc !== undefined && typeof doc !== 'string') {
      throw new ApiError(400, 'Doc must be a string');
    }
    if (lectureLink !== undefined && typeof lectureLink !== 'string') {
      throw new ApiError(400, 'Lecture link must be a string');
    }

    // Create lesson
    const lesson = new Lesson({
      title,
      unit,
      content: content || '',
      order,
      doc: doc || '',
      lectureLink: lectureLink || '',
      duration: duration || 0,
      completed: completed || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await lesson.save();

    // Update unit's lessons array
    await Unit.findByIdAndUpdate(unit, { $push: { lessons: lesson._id } });

    

    return res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: {
        id: lesson._id,
        title: lesson.title,
        unit: lesson.unit,
        content: lesson.content,
        order: lesson.order,
        doc: lesson.doc,
        lectureLink: lesson.lectureLink,
        duration: lesson.duration,
        completed: lesson.completed,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
      },
    });
  } catch (error) {
      return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const filter = {};
    if (req.query.unit) {
      validateObjectId(req.query.unit, 'unit ID');
      filter.unit = req.query.unit;
    }

    const lessons = await Lesson.find(filter)
      .populate('unit', 'title')
      .sort({ order: 1 })
      .lean();


    return res.status(200).json({
      success: true,
      data: lessons.map((lesson) => ({
        ...lesson,
        id: lesson._id,
      })),
    });
  } catch (error) {

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    validateObjectId(req.params.id, 'lesson ID');

    const lesson = await Lesson.findById(req.params.id)
      .populate('unit', 'title')
      .lean();

    if (!lesson) {
      throw new ApiError(404, 'Lesson not found');
    }

    return res.status(200).json({
      success: true,
      data: {
        ...lesson,
        id: lesson._id,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { title, unit, content, order, doc, lectureLink, duration, completed } = req.body;

    validateObjectId(req.params.id, 'lesson ID');

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new ApiError(404, 'Lesson not found');
    }

    // Validate unit if provided
    let newUnit = lesson.unit;
    if (unit && unit !== lesson.unit.toString()) {
      validateObjectId(unit, 'unit ID');
      const unitExists = await Unit.findById(unit).lean();
      if (!unitExists) {
        throw new ApiError(404, 'New unit not found');
      }
      newUnit = unit;
    }

    // Validate order uniqueness if changed
    if ((order !== undefined && order !== lesson.order) || (unit && unit !== lesson.unit.toString())) {
      const duplicateOrder = await Lesson.findOne({
        _id: { $ne: lesson._id },
        unit: unit || lesson.unit,
        order: order !== undefined ? order : lesson.order,
      }).lean();

      if (duplicateOrder) {
        throw new ApiError(400, 'Order already exists for this unit');
      }
    }

    // Validate optional fields
    if (duration !== undefined && (typeof duration !== 'number' || duration <= 0)) {
      throw new ApiError(400, 'Duration must be a positive number');
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      throw new ApiError(400, 'Completed must be a boolean');
    }
    if (doc !== undefined && typeof doc !== 'string') {
      throw new ApiError(400, 'Doc must be a string');
    }
    if (lectureLink !== undefined && typeof lectureLink !== 'string') {
      throw new ApiError(400, 'Lecture link must be a string');
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(unit && { unit }),
      ...(content !== undefined && { content }),
      ...(order !== undefined && { order }),
      ...(doc !== undefined && { doc }),
      ...(lectureLink !== undefined && { lectureLink }),
      ...(duration !== undefined && { duration }),
      ...(completed !== undefined && { completed }),
      updatedAt: Date.now(),
    };

    // Update unit references if unit changed
    if (unit && unit !== lesson.unit.toString()) {
      await Unit.findByIdAndUpdate(lesson.unit, { $pull: { lessons: lesson._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { lessons: lesson._id } });
    }

    // Update lesson
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();


    return res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: {
        id: updatedLesson._id,
        title: updatedLesson.title,
        unit: updatedLesson.unit,
        content: updatedLesson.content,
        order: updatedLesson.order,
        doc: updatedLesson.doc,
        lectureLink: updatedLesson.lectureLink,
        duration: updatedLesson.duration,
        completed: updatedLesson.completed,
        createdAt: updatedLesson.createdAt,
        updatedAt: updatedLesson.updatedAt,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    validateObjectId(req.params.id, 'lesson ID');

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new ApiError(404, 'Lesson not found');
    }

    // Remove lesson from unit's lessons array
    await Unit.findByIdAndUpdate(lesson.unit, { $pull: { lessons: lesson._id } });

    // Delete lesson
    await lesson.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
      return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

exports.updateLessonCompleted = async (req, res) => {
  try {
    const { completed } = req.body;

    validateObjectId(req.params.id, 'lesson ID');

    validateRequiredFields(['completed'], { completed });
    if (typeof completed !== 'boolean') {
      throw new ApiError(400, 'Completed must be a boolean');
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new ApiError(404, 'Lesson not found');
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: { completed, updatedAt: Date.now() } },
      { new: true, runValidators: true }
    )
      .populate('unit', 'title')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Lesson completed status updated successfully',
      data: {
        id: updatedLesson._id,
        title: updatedLesson.title,
        unit: updatedLesson.unit,
        content: updatedLesson.content,
        order: updatedLesson.order,
        doc: updatedLesson.doc,
        lectureLink: updatedLesson.lectureLink,
        duration: updatedLesson.duration,
        completed: updatedLesson.completed,
        createdAt: updatedLesson.createdAt,
        updatedAt: updatedLesson.updatedAt,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};