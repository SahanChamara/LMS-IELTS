const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const Report = require('../models/Report');

const VALID_REPORT_TYPES = ['course_performance', 'student_engagement', 'gradebook'];
const VALID_FORMATS = ['pdf', 'csv'];

const validateReportData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.type) {
    if (!data.type) errors.push('Type is required');
    else if (!VALID_REPORT_TYPES.includes(data.type)) {
      errors.push(`Invalid report type. Must be one of: ${VALID_REPORT_TYPES.join(', ')}`);
    }
  }

  if (!isUpdate || data.format) {
    if (data.format && !VALID_FORMATS.includes(data.format)) {
      errors.push(`Invalid format. Must be one of: ${VALID_FORMATS.join(', ')}`);
    }
  }

  if (!isUpdate || data.data) {
    if (data.data && (typeof data.data !== 'object' || Array.isArray(data.data))) {
      errors.push('Data must be a valid object');
    }
  }

  return errors;
};

const sendResponse = (res, status, success, message, data = null, error = null) => {
  const response = { success, message };
  if (data) response.data = data;
  if (error) response.error = error.message;
  res.status(status).json(response);
};

exports.createReport = async (req, res) => {
  try {
    const { type, data, format } = req.body;

    const errors = validateReportData({ type, data, format });
    if (errors.length > 0) {
      return sendResponse(res, 400, false, errors.join('; '));
    }

    // Validate that the user role is valid
    const validRoles = ['SuperAdmin', 'Instructor', 'Student'];
    if (!validRoles.includes(req.user.role)) {
      return sendResponse(res, 400, false, 'Invalid user role');
    }

    const report = new Report({
      type: sanitize(type),
      generatedBy: req.user.id,
      generatedByModel: req.user.role,
      data: sanitize(data || {}),
      format: sanitize(format || 'pdf'),
      createdAt: new Date(),
    });

    await report.save();
    const populatedReport = await Report.findById(report._id)
      .populate('generatedBy', 'name email')
      .lean();

    sendResponse(res, 201, true, 'Report created successfully', {
      id: populatedReport._id,
      type: populatedReport.type,
      generatedBy: populatedReport.generatedBy,
      generatedByModel: populatedReport.generatedByModel,
      data: populatedReport.data,
      format: populatedReport.format,
      createdAt: populatedReport.createdAt,
    });
  } catch (error) {
    sendResponse(res, 500, false, 'Error creating report', null, error);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    sendResponse(res, 200, true, 'Reports fetched successfully', reports);
  } catch (error) {
    sendResponse(res, 500, false, 'Error fetching reports', null, error);
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, 'Invalid report ID');
    }

    const report = await Report.findById(id)
      .populate('generatedBy', 'name email')
      .lean();

    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    sendResponse(res, 200, true, 'Report fetched successfully', report);
  } catch (error) {
    sendResponse(res, 500, false, 'Error fetching report', null, error);
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data, format } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, 'Invalid report ID');
    }

    const errors = validateReportData({ type, data, format }, true);
    if (errors.length > 0) {
      return sendResponse(res, 400, false, errors.join('; '));
    }

    const report = await Report.findById(id);
    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    const updateData = {
      ...(type && { type: sanitize(type) }),
      ...(data && { data: sanitize(data) }),
      ...(format && { format: sanitize(format) }),
      updatedAt: new Date(),
    };

    Object.assign(report, updateData);
    await report.save();

    const updatedReport = await Report.findById(id)
      .populate('generatedBy', 'name email')
      .lean();

    sendResponse(res, 200, true, 'Report updated successfully', {
      id: updatedReport._id,
      type: updatedReport.type,
      generatedBy: updatedReport.generatedBy,
      data: updatedReport.data,
      format: updatedReport.format,
      createdAt: updatedReport.createdAt,
      updatedAt: updatedReport.updatedAt,
    });
  } catch (error) {
    sendResponse(res, 500, false, 'Error updating report', null, error);
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, 'Invalid report ID');
    }

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return sendResponse(res, 404, false, 'Report not found');
    }

    sendResponse(res, 200, true, 'Report deleted successfully');
  } catch (error) {
    sendResponse(res, 500, false, 'Error deleting report', null, error);
  }
};
