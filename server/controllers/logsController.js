  const mongoose = require('mongoose');
  const Log = require('../models/Logs');
  const Unit = require('../models/Unit');
  const Student = require('../models/Student');

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

  exports.createLog = async (req, res) => {
    try {
      const { user, unit } = req.body;

      // Validate required fields
      validateRequiredFields(['user', 'unit'], { user, unit });
      validateObjectId(user, 'student ID');
      validateObjectId(unit, 'unit ID');

      // Validate unit exists
      const unitExists = await Unit.findById(unit).lean();
      if (!unitExists) {
        throw new ApiError(404, 'Unit not found');
      }

      // Validate student exists
      const studentExists = await Student.findById(user).lean();
      if (!studentExists) {
        throw new ApiError(404, 'Student not found');
      }

      // Create log
      const log = new Log({
        user,
        unit,
        date: Date.now(),
      });

      await log.save();

      // Update unit's logs array
      await Unit.findByIdAndUpdate(unit, { $push: { logs: log._id } });

      return res.status(201).json({
        success: true,
        message: 'Log created successfully',
        data: {
          id: log._id,
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

  exports.getLogs = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        throw new ApiError(401, 'Not authenticated');
      }

      const filter = {};

      // Apply filters
      if (req.query.unit) {
        validateObjectId(req.query.unit, 'unit ID');
        filter.unit = req.query.unit;
      }
      if (req.query.user) {
        validateObjectId(req.query.user, 'student ID');
        filter.user = req.query.user;
      }

      // Restrict students to their own logs
      if (req.user?.role === 'Student') {
        filter.user = req.user._id;
      }

      const logs = await Log.find(filter)
        .populate('unit', 'title')
        .populate('user', 'name')
        .sort({ date: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        data: logs.map((log) => ({
          id: log._id,
          user: log.user,
          unit: log.unit,
          date: log.date,
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

  exports.getLogById = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        throw new ApiError(401, 'Not authenticated');
      }

      validateObjectId(req.params.id, 'log ID');

      const log = await Log.findById(req.params.id)
        .populate('unit', 'title')
        .populate('user', 'name')
        .lean();

      if (!log) {
        throw new ApiError(404, 'Log not found');
      }

      // Restrict access: Students can only view their own logs
      if (req.user?.role === 'Student' && log.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
      }

      return res.status(200).json({
        success: true,
        data: {
          id: log._id,
          user: log.user,
          unit: log.unit,
          date: log.date,
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

  exports.deleteLog = async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        throw new ApiError(401, 'Not authenticated');
      }

      validateObjectId(req.params.id, 'log ID');

      const log = await Log.findById(req.params.id);
      if (!log) {
        throw new ApiError(404, 'Log not found');
      }

      // Restrict access: Only SuperAdmin or the log's student can delete
      if (req.user?.role !== 'SuperAdmin' && log.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
      }

      // Remove log from unit's logs array
      await Unit.findByIdAndUpdate(log.unit, { $pull: { logs: log._id } });

      // Delete log
      await log.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Log deleted successfully',
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  };

  exports.getLastFiveUniqueUnitsByStudent = async (req, res) => {
    try {
      const userID  = req.params.id;
      console.log("Received userID:", userID);

      // Validate userID
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      // Aggregation pipeline to get the last 5 unique units
      const logs = await mongoose.model("Log").aggregate([
        // Match logs for the given user ID
        { $match: { user: new mongoose.Types.ObjectId(userID) } },
        // Sort by date in descending order (most recent first)
        { $sort: { date: -1 } },
        // Group by unit to remove duplicates, keeping the first (most recent) entry
        {
          $group: {
            _id: "$unit",
            date: { $first: "$date" },
            user: { $first: "$user" },
          },
        },
        // Sort again by date to maintain chronological order
        { $sort: { date: -1 } },
        // Limit to 5 results
        { $limit: 5 },
        // Optionally populate unit details
        {
          $lookup: {
            from: "units", // The collection name for Unit model
            localField: "_id",
            foreignField: "_id",
            as: "unitDetails",
          },
        },
        // Unwind the unitDetails array to get a single object
        { $unwind: "$unitDetails" },
        // Project the desired fields
        {
          $project: {
            _id: 0,
            unit: "$unitDetails",
            date: 1,
          },
        },
      ]);

      // Check if any logs were found
      if (!logs.length) {
        return res.status(404).json({
          success: false,
          message: "No units found for this user",
        });
      }

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  };