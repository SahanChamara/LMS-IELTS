const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

exports.createAuditLog = async (req, res) => {
  try {
    const { action, user, userType, details } = req.body;

    if (!action || !user || !userType) {
      return res.status(400).json({ success: false, message: 'Action, user, and userType are required' });
    }

    if (!['Student', 'Instructor', 'SuperAdmin'].includes(userType)) {
      return res.status(400).json({ success: false, message: 'Invalid userType' });
    }

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmins can create audit logs' });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const auditLog = new AuditLog({
      action,
      user,
      userType,
      details,
      createdBy: req.user.id
    });

    await auditLog.save();

    res.status(201).json({ success: true, data: auditLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating audit log', error: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { userId, action, userType } = req.query;
    let query = {};

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmins can view audit logs' });
    }

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
      query.user = userId;
    }

    if (action) {
      query.action = action;
    }

    if (userType) {
      if (!['Student', 'Instructor', 'SuperAdmin'].includes(userType)) {
        return res.status(400).json({ success: false, message: 'Invalid userType' });
      }
      query.userType = userType;
    }

    const auditLogs = await AuditLog.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: auditLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit logs', error: error.message });
  }
};

exports.getAuditLogById = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmins can view audit logs' });
    }

    const auditLog = await AuditLog.findById(req.params.id)
      .populate('user', 'name');

    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    res.status(200).json({ success: true, data: auditLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching audit log', error: error.message });
  }
};

exports.updateAuditLog = async (req, res) => {
  try {
    const { action, details } = req.body;

    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmins can update audit logs' });
    }

    const auditLog = await AuditLog.findById(req.params.id);
    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    const updateData = {
      ...(action && { action }),
      ...(details && { details }),
      updatedBy: req.user.id,
      updatedAt: Date.now()
    };

    const updatedAuditLog = await AuditLog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('user', 'name');

    res.status(200).json({ success: true, data: updatedAuditLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating audit log', error: error.message });
  }
};

exports.deleteAuditLog = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmins can delete audit logs' });
    }

    const auditLog = await AuditLog.findById(req.params.id);

    if (!auditLog) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }

    await auditLog.deleteOne();

    res.status(200).json({ success: true, message: 'Audit log deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting audit log', error: error.message });
  }
};