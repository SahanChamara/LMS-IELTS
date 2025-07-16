const Assessment = require('../models/Assessment');
const Unit = require('../models/Unit');
const mongoose = require('mongoose');

exports.createAssessment = async (req, res) => {
  try {
    const { title, unit, description, dueDate, totalMarks, questionsCount, duration, passPercentage, caMarksPercetage, status } = req.body;

    // Validate required fields
    if (!title || !unit || totalMarks === undefined || questionsCount === undefined || duration === undefined || passPercentage === undefined || caMarksPercetage === undefined) {
      return res.status(400).json({ success: false, message: 'Title, unit, totalMarks, questionsCount, duration, passPercentage, and caMarksPercetage are required' });
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
      return res.status(400).json({ success: false, message: 'Status must be either "active" or "inactive"' });
    }

    const assessmentData = {
      title,
      unit,
      ...(description && { description }),
      ...(dueDate && { dueDate }),
      totalMarks,
      questionsCount,
      duration,
      passPercentage,
      caMarksPercetage,
      ...(status && { status }),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const assessment = new Assessment(assessmentData);
    await assessment.save();

    await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating assessment', error: error.message });
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const { unitId } = req.query;
    let query = {};

    if (unitId) {
      if (!mongoose.Types.ObjectId.isValid(unitId)) {
        return res.status(400).json({ success: false, message: 'Invalid unit ID' });
      }
      query.unit = unitId;
    }

    const assessments = await Assessment.find(query)
        .populate('unit', 'title')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessments', error: error.message });
  }
};

exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
        .populate('unit', 'title');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, data: [assessment] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessment', error: error.message });
  }
};

exports.getAssessmentsByUnitId = async (req, res) => {
  try {
    const assessments = await Assessment.find({ unit: req.params.unitId })
        .populate('unit', 'title');

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ success: false, message: 'No assessments found for this unit' });
    }

    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assessments', error: error.message });
  }
};


exports.updateAssessment = async (req, res) => {
  try {
    const { title, unit, description, dueDate, totalMarks, questionsCount, duration, passPercentage, caMarksPercetage, status } = req.body;

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
      return res.status(400).json({ success: false, message: 'Status must be either "active" or "inactive"' });
    }

    // Ensure at least one field is provided for update
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: 'At least one field must be provided for update' });
    }

    const updateData = {
      ...(title && { title }),
      ...(unit && { unit }),
      ...(description && { description }),
      ...(dueDate && { dueDate }),
      ...(totalMarks !== undefined && { totalMarks }),
      ...(questionsCount !== undefined && { questionsCount }),
      ...(duration !== undefined && { duration }),
      ...(passPercentage !== undefined && { passPercentage }),
      ...(caMarksPercetage !== undefined && { caMarksPercetage }),
      ...(status && { status }),
      updatedAt: Date.now(),
    };

    const assessment = await Assessment.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (unit && unit !== assessment.unit.toString()) {
      await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });
      await Unit.findByIdAndUpdate(unit, { $push: { assessments: assessment._id } });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating assessment', error: error.message });
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    await Unit.findByIdAndUpdate(assessment.unit, { $pull: { assessments: assessment._id } });

    await assessment.deleteOne();

    res.status(200).json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assessment', error: error.message });
  }
};