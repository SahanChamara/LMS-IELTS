const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const validator = require('validator');
const Certificate = require('../models/Certificate');

const sendError = (res, status, message, error = null) => {
  res.status(status).json({ success: false, message, error: error?.message });
};

exports.createCertificate = async (req, res) => {
  try {
    const { student, course, issueDate, pdfUrl } = req.body;

    if (!student || !course) {
      return sendError(res, 400, 'Student and course are required');
    }

    if (!mongoose.isValidObjectId(student)) {
      return sendError(res, 400, 'Invalid student ID');
    }
    if (!mongoose.isValidObjectId(course)) {
      return sendError(res, 400, 'Invalid course ID');
    }
    if (issueDate && !validator.isISO8601(issueDate)) {
      return sendError(res, 400, 'Invalid issueDate format. Use ISO 8601 (e.g., 2025-05-26T00:00:00Z)');
    }
    if (pdfUrl && !validator.isURL(pdfUrl)) {
      return sendError(res, 400, 'Invalid pdfUrl format');
    }

    const sanitizedStudent = sanitize(student);
    const sanitizedCourse = sanitize(course);
    const sanitizedPdfUrl = pdfUrl ? sanitize(pdfUrl) : '';

    const certificate = new Certificate({
      student: sanitizedStudent,
      course: sanitizedCourse,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      pdfUrl: sanitizedPdfUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await certificate.save();
    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate('student', 'name email')
      .populate('course', 'title description');

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: {
        id: populatedCertificate._id,
        student: populatedCertificate.student,
        course: populatedCertificate.course,
        issueDate: populatedCertificate.issueDate,
        pdfUrl: populatedCertificate.pdfUrl,
        createdAt: populatedCertificate.createdAt,
        updatedAt: populatedCertificate.updatedAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error creating certificate', error);
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    }

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .populate('course', 'title description')
      .sort({ issueDate: -1 });

    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    sendError(res, 500, 'Error fetching certificates', error);
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid certificate ID');
    }

    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description');

    if (!certificate) {
      return sendError(res, 404, 'Certificate not found');
    }

    if (req.user.role === 'Student' && certificate.student.toString() !== req.user.id) {
      return sendError(res, 403, 'Students can only access their own certificates');
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    sendError(res, 500, 'Error fetching certificate', error);
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const { student, course, issueDate, pdfUrl } = req.body;

    if (student && !mongoose.isValidObjectId(student)) {
      return sendError(res, 400, 'Invalid student ID');
    }
    if (course && !mongoose.isValidObjectId(course)) {
      return sendError(res, 400, 'Invalid course ID');
    }
    if (issueDate && !validator.isISO8601(issueDate)) {
      return sendError(res, 400, 'Invalid issueDate format. Use ISO 8601 (e.g., 2025-05-26T00:00:00Z)');
    }
    if (pdfUrl && !validator.isURL(pdfUrl)) {
      return sendError(res, 400, 'Invalid pdfUrl format');
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid certificate ID');
    }

    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return sendError(res, 404, 'Certificate not found');
    }

    const updateData = {};
    if (student) updateData.student = sanitize(student);
    if (course) updateData.course = sanitize(course);
    if (issueDate) updateData.issueDate = new Date(issueDate);
    if (pdfUrl) updateData.pdfUrl = sanitize(pdfUrl);
    updateData.updatedAt = new Date();

    await Certificate.updateOne({ _id: req.params.id }, { $set: updateData });

    const updatedCertificate = await Certificate.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description');

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: {
        id: updatedCertificate._id,
        student: updatedCertificate.student,
        course: updatedCertificate.course,
        issueDate: updatedCertificate.issueDate,
        pdfUrl: updatedCertificate.pdfUrl,
        createdAt: updatedCertificate.createdAt,
        updatedAt: updatedCertificate.updatedAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error updating certificate', error);
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid certificate ID');
    }

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return sendError(res, 404, 'Certificate not found');
    }

    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Error deleting certificate', error);
  }
};

exports.filterCertificates = async (req, res) => {
  try {
    const { student, course } = req.query;
    const query = {};

    if (req.user.role === 'Student') {
      query.student = req.user.id;
    }

    if (student) {
      if (!mongoose.isValidObjectId(student)) {
        return sendError(res, 400, 'Invalid student ID');
      }
      query.student = sanitize(student);
    }

    if (course) {
      if (!mongoose.isValidObjectId(course)) {
        return sendError(res, 400, 'Invalid course ID');
      }
      query.course = sanitize(course);
    }

    const certificates = await Certificate.find(query)
      .populate('student', 'name email')
      .populate('course', 'title description')
      .sort({ issueDate: -1 });

    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    sendError(res, 500, 'Error filtering certificates', error);
  }
};