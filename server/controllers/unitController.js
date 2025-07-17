const mongoose = require('mongoose');
const Unit = require('../models/Unit');
const Instructor = require('../models/Instructor'); // Import Instructor model for validation
const { Logs } = require('../models');

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

const validateObjectIdArray = (array, name) => {
    if (array && !array.every(id => mongoose.isValidObjectId(id))) {
        throw new ApiError(400, `Invalid ${name} ID(s)`);
    }
};

const findUnitById = async (id, populateOptions = []) => {
    validateObjectId(id, 'unit ID');
    const unit = await Unit.findById(id)
        .populate(populateOptions)
        .lean();
    if (!unit) {
        throw new ApiError(404, 'Unit not found');
    }
    return unit;
};

// Updated populate options to include instructor
const populateOptions = [
    { path: 'course', select: 'title description' },
    { path: 'subUnits', select: 'title order' },
    { path: 'lessons', select: 'title content doc lectureLink duration completed' },
    { path: 'assessments', select: 'title type quizList questionsCount duration passPercentage totalMarks description status dueDate' },
    { path: 'exams', select: 'title date' },
    { path: 'instructor', select: 'name email' }
];

exports.createUnit = async (req, res) => {
    try {
        const {
            title,
            course,
            order,
            subUnits,
            lessons,
            assessments,
            exams,
            studyMaterials,
            image,
            credits,
            description,
            instructor,
            timePeriod
        } = req.body;

        // Validate required fields
        validateRequiredFields(['title', 'order', 'description', 'timePeriod'], {
            title,
            order,
            description,
            timePeriod
        });

        // Validate ObjectIds
        if (course) validateObjectId(course, 'course ID');
        if (instructor) validateObjectId(instructor, 'instructor ID');
        validateObjectIdArray(subUnits, 'subUnit');
        validateObjectIdArray(lessons, 'lesson');
        validateObjectIdArray(assessments, 'assessment');
        validateObjectIdArray(exams, 'exam');

        // Validate instructor exists if provided
        if (instructor) {
            const instructorExists = await Instructor.findById(instructor).lean();
            if (!instructorExists) {
                throw new ApiError(404, 'Instructor not found');
            }
        }

        // Validate timePeriod is a positive number
        if (typeof timePeriod !== 'number' || timePeriod <= 0) {
            throw new ApiError(400, 'timePeriod must be a positive number');
        }

        const unit = new Unit({
            title,
            course: course || null,
            order,
            subUnits: subUnits || [],
            lessons: lessons || [],
            assessments: assessments || [],
            exams: exams || [],
            studyMaterials: studyMaterials || [],
            image: image || '',
            credits: credits || '',
            discussions: [],
            description,
            instructor: instructor || null,
            timePeriod,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        await unit.save();

        return res.status(201).json({
            success: true,
            message: 'Unit created successfully',
            data: {
                id: unit._id,
                title: unit.title,
                course: unit.course,
                order: unit.order,
                subUnits: unit.subUnits,
                lessons: unit.lessons,
                assessments: unit.assessments,
                exams: unit.exams,
                studyMaterials: unit.studyMaterials,
                image: unit.image,
                credits: unit.credits,
                discussions: unit.discussions,
                description: unit.description,
                instructor: unit.instructor,
                timePeriod: unit.timePeriod,
                createdAt: unit.createdAt,
                updatedAt: unit.updatedAt
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.getAllUnits = async (req, res) => {
    try {
        const { page = 1, limit = 10, course } = req.query;
        const query = {};


        if (course) {
            validateObjectId(course, 'course ID');
            query.course = course;
        }

        const units = await Unit.find(query)
            .populate(populateOptions)
            .limit(Number(limit))
            .skip((page - 1) * Number(limit))
            .sort({ order: 1 })
            .lean();

        const total = await Unit.countDocuments(query);


        return res.status(200).json({
            success: true,
            data: units.map(unit => ({
                ...unit,
                id: unit._id
            })),
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.getUnitById = async (req, res) => {
    try {
        const unit = await findUnitById(req.params.id, populateOptions);

        return res.status(200).json({
            success: true,
            data: {
                ...unit,
                id: unit._id
            }
        });
    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const {
            title,
            course,
            order,
            subUnits,
            lessons,
            assessments,
            exams,
            studyMaterials,
            image,
            credits,
            description,
            instructor,
            timePeriod
        } = req.body;

        // Validate ObjectIds
        if (course) validateObjectId(course, 'course ID');
        if (instructor) validateObjectId(instructor, 'instructor ID');
        validateObjectIdArray(subUnits, 'subUnit');
        validateObjectIdArray(lessons, 'lesson');
        validateObjectIdArray(assessments, 'assessment');
        validateObjectIdArray(exams, 'exam');

        // Validate instructor exists if provided
        if (instructor) {
            const instructorExists = await Instructor.findById(instructor).lean();
            if (!instructorExists) {
                throw new ApiError(404, 'Instructor not found');
            }
        }

        // Validate timePeriod if provided
        if (timePeriod !== undefined && (typeof timePeriod !== 'number' || timePeriod <= 0)) {
            throw new ApiError(400, 'timePeriod must be a positive number');
        }

        const updateData = {
            ...(title && { title }),
            ...(typeof course !== 'undefined' && { course: course || null }),
            ...(order !== undefined && { order }),
            ...(subUnits && { subUnits }),
            ...(lessons && { lessons }),
            ...(assessments && { assessments }),
            ...(exams && { exams }),
            ...(studyMaterials && { studyMaterials }),
            ...(image !== undefined && { image }),
            ...(credits !== undefined && { credits }),
            ...(description && { description }),
            ...(typeof instructor !== 'undefined' && { instructor: instructor || null }),
            ...(timePeriod !== undefined && { timePeriod }),
            updatedAt: Date.now()
        };

        const unit = await Unit.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }



        return res.status(200).json({
            success: true,
            message: 'Unit updated successfully',
            data: {
                id: unit._id,
                title: unit.title,
                course: unit.course,
                order: unit.order,
                subUnits: unit.subUnits,
                lessons: unit.lessons,
                assessments: unit.assessments,
                exams: unit.exams,
                studyMaterials: unit.studyMaterials,
                image: unit.image,
                credits: unit.credits,
                discussions: unit.discussions,
                description: unit.description,
                instructor: unit.instructor,
                timePeriod: unit.timePeriod,
                createdAt: unit.createdAt,
                updatedAt: unit.updatedAt
            }
        });
    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);
        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }


        return res.status(200).json({
            success: true,
            message: 'Unit deleted successfully'
        });
    } catch (error) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.addSubUnit = async (req, res) => {
    try {
        const { subUnitId } = req.body;
        validateObjectId(subUnitId, 'subUnit ID');

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { subUnits: subUnitId } },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }

        return res.status(200).json({
            success: true,
            message: 'Sub-unit added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.addLesson = async (req, res) => {
    try {
        const { lessonId } = req.body;
        validateObjectId(lessonId, 'lesson ID');

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { lessons: lessonId } },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }

        return res.status(200).json({
            success: true,
            message: 'Lesson added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.addAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.body;
        validateObjectId(assessmentId, 'assessment ID');

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { assessments: assessmentId } },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }

        return res.status(200).json({
            success: true,
            message: 'Assessment added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.addExam = async (req, res) => {
    try {
        const { examId } = req.body;
        validateObjectId(examId, 'exam ID');

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { exams: examId } },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }


        return res.status(200).json({
            success: true,
            message: 'Exam added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

exports.addStudyMaterial = async (req, res) => {
    try {
        const { url, title, type } = req.body;
        validateRequiredFields(['url', 'title', 'type'], { url, title, type });

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { $push: { studyMaterials: { url, title, type } } },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }


        return res.status(200).json({
            success: true,
            message: 'Study material added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

/*
exports.addDiscussion = async (req, res) => {
    try {
        const { question } = req.body;
        validateRequiredFields(['question'], { question });

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    discussions: {
                        question,
                        answers: [],
                        userType: req.user.role,
                        user: req.user.id
                    }
                }
            },
            { new: true }
        ).lean();

        if (!unit) {
            throw new ApiError(404, 'Unit not found');
        }

        return res.status(200).json({
            success: true,
            message: 'Discussion added to unit',
            data: unit
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};*/


//=========================================================================================
exports.getAllUnitsByInstructor = async (req, res) => {
  try {
    // const { page = 1, limit = 10, course } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const instructorId = req.params.id;

    if (!mongoose.isValidObjectId(instructorId)) {
      return res.status(400).json({ message: 'Invalid instructor ID' });
    }

    const query = { instructor: instructorId };

    // if (course) {
    //   validateObjectId(course, 'course ID');
    //   query.course = course;
    // }

    const units = await Unit.find(query)
      .select('unitCode title description image') // Only fetch the needed fields
      .limit(Number(limit))
      .skip((page - 1) * Number(limit))
      .sort({ order: 1 })
      .lean();

    const total = await Unit.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: units.map(unit => ({
        id: unit._id,
        unitCode: unit.unitCode,
        title: unit.title,
        description: unit.description,
        image: unit.image
      })),
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: 'Error fetching units by instructor',
      error: error.message
    });
  }
};
//=========================================================================================