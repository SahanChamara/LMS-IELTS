const Quiz = require('../models/Quiz');
const Assessment = require('../models/Assessment');
const mongoose = require('mongoose');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { question, options, answer, assessment, mark } = req.body;

    // Validate required fields
    if (!question || !options || answer === undefined || !assessment || mark === undefined) {
      return res.status(400).json({ success: false, message: 'Question, options, answer, assessment, and mark are required' });
    }

    // Validate assessment exists
    if (!mongoose.Types.ObjectId.isValid(assessment)) {
      return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
    }
    const assessmentExists = await Assessment.findById(assessment);
    if (!assessmentExists) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Validate options array and answer index
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Options must be an array with at least 2 items' });
    }
    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
      return res.status(400).json({ success: false, message: 'Answer must be a valid index of the options array' });
    }

    // Check for unique question
    const existingQuiz = await Quiz.findOne({ question });
    if (existingQuiz) {
      return res.status(400).json({ success: false, message: 'Question must be unique' });
    }

    // Create quiz
    const quiz = new Quiz({
      question,
      options,
      answer,
      assessment,
      mark,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save quiz
    const response = await quiz.save();

    // Add quiz to assessment's quizzes array
    await Assessment.findByIdAndUpdate(assessment, { $push: { quizzes: quiz._id } });

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating quiz', error: error.message });
  }
};

// Get quizzes by assessment ID from path parameter
exports.getQuizzes = async (req, res) => {
  try {
    const { id: assessmentId } = req.params;

    // Validate assessment ID
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
    }

    // Verify assessment exists
    const assessmentExists = await Assessment.findById(assessmentId);
    if (!assessmentExists) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Fetch quizzes for the specified assessment
    const quizzes = await Quiz.find({ assessment: assessmentId })
        .populate('assessment', 'title')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quizzes', error: error.message });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
        .populate('assessment', 'title');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching quiz', error: error.message });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { question, options, answer, assessment, mark } = req.body;

    // Validate assessment if provided
    if (assessment) {
      if (!mongoose.Types.ObjectId.isValid(assessment)) {
        return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
      }
      const assessmentExists = await Assessment.findById(assessment);
      if (!assessmentExists) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }
    }

    // Validate options and answer if provided
    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ success: false, message: 'Options must be an array with at least 2 items' });
      }
    }
    if (answer !== undefined) {
      const currentQuiz = await Quiz.findById(req.params.id);
      const optionArray = options || currentQuiz.options;
      if (!Number.isInteger(answer) || answer < 0 || answer >= optionArray.length) {
        return res.status(400).json({ success: false, message: 'Answer must be a valid index of the options array' });
      }
    }

    // Check for unique question if changed
    if (question) {
      const existingQuiz = await Quiz.findOne({ question, _id: { $ne: req.params.id } });
      if (existingQuiz) {
        return res.status(400).json({ success: false, message: 'Question must be unique' });
      }
    }

    // Validate mark if provided
    if (mark === undefined && !Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: 'At least one field must be provided for update' });
    }

    // Prepare update data
    const updateData = {
      ...(question && { question }),
      ...(options && { options }),
      ...(answer !== undefined && { answer }),
      ...(assessment && { assessment }),
      ...(mark !== undefined && { mark }),
      updatedAt: Date.now(),
    };

    // Update quiz
    const quiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Update assessment reference if assessment has changed
    if (assessment && assessment !== quiz.assessment.toString()) {
      await Assessment.findByIdAndUpdate(quiz.assessment, { $pull: { quizzes: quiz._id } });
      await Assessment.findByIdAndUpdate(assessment, { $push: { quizzes: quiz._id } });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating quiz', error: error.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Remove quiz from assessment's quizzes array
    await Assessment.findByIdAndUpdate(quiz.assessment, { $pull: { quizzes: quiz._id } });

    // Delete quiz
    await quiz.deleteOne();

    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting quiz', error: error.message });
  }
};