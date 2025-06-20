const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');
const mongoose = require('mongoose');

exports.createSubmission = async (req, res) => {
  try {
    const { student, assessment, content } = req.body;

    if (!student || !assessment || !content) {
      return res.status(400).json({ success: false, message: 'Student, assessment, and content are required' });
    }

    const assessmentExists = await Assessment.findById(assessment);
    if (!assessmentExists) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (req.user.role === 'Student' && req.user.id !== student) {
      return res.status(403).json({ success: false, message: 'Students can only submit for themselves' });
    }

    const submission = new Submission({
      student,
      assessment,
      content,
      status: 'submitted',
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    await submission.save();

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating submission', error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { assessmentId, studentId } = req.query;
    let query = {};

    if (assessmentId) {
      if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
        return res.status(400).json({ success: false, message: 'Invalid assessment ID' });
      }
      query.assessment = assessmentId;
    }

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ success: false, message: 'Invalid student ID' });
      }
      query.student = studentId;
    }

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name')
      .populate('assessment', 'title')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching submissions', error: error.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name')
      .populate('assessment', 'title');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (req.user.role === 'Student' && submission.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching submission', error: error.message });
  }
};

exports.updateSubmission = async (req, res) => {

  console.log('Update submission request:', req.body, req.params.id, req.user);
  

  try {
    const { content, score, feedback, status } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (req.user.role === 'Student') {
      if (submission.student.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Students can only update their own submissions' });
      }
      if (submission.status !== 'pending') {
        return res.status(403).json({ success: false, message: 'Cannot update graded or submitted submissions' });
      }
      if (score || feedback || status) {
        return res.status(403).json({ success: false, message: 'Students cannot update score, feedback, or status' });
      }
    }

    if (status && !['submitted', 'graded', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (score) {
      const assessment = await Assessment.findById(submission.assessment);
      if (score > assessment.maxScore) {
        return res.status(400).json({ success: false, message: 'Score exceeds assessment maxScore' });
      }
    }

    const updateData = {
      ...(content && { content }),
      ...(score !== undefined && { score }),
      ...(feedback && { feedback }),
      ...(status && { status }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('student', 'name')
      .populate('assessment', 'title');

    res.status(200).json({ success: true, data: updatedSubmission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating submission', error: error.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (req.user.role === 'Student' && submission.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Students can only delete their own submissions' });
    }

    await submission.deleteOne();

    res.status(200).json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting submission', error: error.message });
  }
};