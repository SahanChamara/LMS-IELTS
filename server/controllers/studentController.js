const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const Student = require('../models/Student');

const sendError = (res, status, message, error = null) => {
  res.status(status).json({ success: false, message, error: error?.message });
};

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return sendError(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, and a number');
    }

    // Validate profile nested fields
    if (profile) {
      if (profile.photo && typeof profile.photo !== 'string') {
        return sendError(res, 400, 'Invalid photo format');
      }
      if (profile.phone && typeof profile.phone !== 'string') {
        return sendError(res, 400, 'Invalid phone format');
      }
      if (profile.country && typeof profile.country !== 'string') {
        return sendError(res, 400, 'Invalid country format');
      }
      if (profile.city && typeof profile.city !== 'string') {
        return sendError(res, 400, 'Invalid city format');
      }
      if (profile.DOB && !/^\d{4}-\d{2}-\d{2}$/.test(profile.DOB)) {
        return sendError(res, 400, 'Invalid DOB format (YYYY-MM-DD)');
      }
      if (profile.preferences) {
        if (typeof profile.preferences.notifications !== 'boolean') {
          return sendError(res, 400, 'Invalid notifications preference');
        }
        if (profile.preferences.language && typeof profile.preferences.language !== 'string') {
          return sendError(res, 400, 'Invalid language preference');
        }
      }
    }

    const sanitizedEmail = sanitize(email);
    const sanitizedName = sanitize(name);
    const sanitizedProfile = sanitize(profile) || {
      country: 'Sri Lanka',
      city: 'Colombo',
      DOB: '0000-00-00',
      preferences: { notifications: true, language: 'en' }
    };

    const existingStudent = await Student.findOne({ email: sanitizedEmail });
    if (existingStudent) {
      return sendError(res, 400, 'Email already in use');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      profile: sanitizedProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await student.save();
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profile: student.profile,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error registering student', error);
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const student = await Student.findOne({ email: sanitize(email) });
    if (!student) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const accessToken = jwt.sign(
        { id: student._id, role: 'Student' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
        { id: student._id, role: 'Student' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    student.refreshToken = refreshToken;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profile: student.profile
      }
    });
  } catch (error) {
    sendError(res, 500, 'Error logging in', error);
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
        .select('-password -refreshToken')
        .populate('enrolledCourse', 'title description')
        .populate('completedCourses', 'title description')
        .populate('certificates', 'title issuedAt')
        .populate('notifications', 'message createdAt');
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    sendError(res, 500, 'Error fetching students', error);
  }
};

exports.getStudentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only access their own data');
    }

    const student = await Student.findById(req.params.id)
        .select('-password -refreshToken')
        .populate('enrolledCourse', 'title description')
        .populate('completedCourses', 'title description')
        .populate('certificates', 'title issuedAt')
        .populate('notifications', 'message createdAt');

    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    sendError(res, 500, 'Error fetching student', error);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only update their own data');
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    if (email && email !== student.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(res, 400, 'Invalid email format');
      }
      const existingStudent = await Student.findOne({ email: sanitize(email) });
      if (existingStudent) {
        return sendError(res, 400, 'Email already in use');
      }
    }

    // Validate profile nested fields
    if (profile) {
      if (profile.photo && typeof profile.photo !== 'string') {
        return sendError(res, 400, 'Invalid photo format');
      }
      if (profile.phone && typeof profile.phone !== 'string') {
        return sendError(res, 400, 'Invalid phone format');
      }
      if (profile.country && typeof profile.country !== 'string') {
        return sendError(res, 400, 'Invalid country format');
      }
      if (profile.city && typeof profile.city !== 'string') {
        return sendError(res, 400, 'Invalid city format');
      }
      if (profile.DOB && !/^\d{4}-\d{2}-\d{2}$/.test(profile.DOB)) {
        return sendError(res, 400, 'Invalid DOB format (YYYY-MM-DD)');
      }
      if (profile.preferences) {
        if (typeof profile.preferences.notifications !== 'boolean') {
          return sendError(res, 400, 'Invalid notifications preference');
        }
        if (profile.preferences.language && typeof profile.preferences.language !== 'string') {
          return sendError(res, 400, 'Invalid language preference');
        }
      }
    }

    const updateData = {
      name: name ? sanitize(name) : undefined,
      email: email ? sanitize(email) : undefined,
      profile: profile ? sanitize(profile) : undefined,
      updatedAt: new Date()
    };

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return sendError(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, and a number');
      }
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
    }

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    Object.assign(student, updateData);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
        .select('-password -refreshToken')
        .populate('enrolledCourse', 'title description')
        .populate('completedCourses', 'title description')
        .populate('certificates', 'title issuedAt')
        .populate('notifications', 'message createdAt');

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    sendError(res, 500, 'Error updating student', error);
  }
};

exports.updateStudentByAdmin = async (req, res) => {
  try {
    if (req.user.role === 'Student') {
      return sendError(res, 403, 'Only instructors and admins can update this data');
    }

    const {
      enrolledCourse,
      completedCourses,
      certificates,
      notifications,
      resetPasswordOTP,
      resetPasswordExpires,
      profile
    } = req.body || {};

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    if (enrolledCourse && student.enrolledCourse && mongoose.isValidObjectId(enrolledCourse) && enrolledCourse !== student.enrolledCourse.toString()) {
      return sendError(res, 400, 'Student can only be enrolled in one course at a time');
    }

    // Validate profile nested fields
    if (profile) {
      if (profile.photo && typeof profile.photo !== 'string') {
        return sendError(res, 400, 'Invalid photo format');
      }
      if (profile.phone && typeof profile.phone !== 'string') {
        return sendError(res, 400, 'Invalid phone format');
      }
      if (profile.country && typeof profile.country !== 'string') {
        return sendError(res, 400, 'Invalid country format');
      }
      if (profile.city && typeof profile.city !== 'string') {
        return sendError(res, 400, 'Invalid city format');
      }
      if (profile.DOB && !/^\d{4}-\d{2}-\d{2}$/.test(profile.DOB)) {
        return sendError(res, 400, 'Invalid DOB format (YYYY-MM-DD)');
      }
      if (profile.preferences) {
        if (typeof profile.preferences.notifications !== 'boolean') {
          return sendError(res, 400, 'Invalid notifications preference');
        }
        if (profile.preferences.language && typeof profile.preferences.language !== 'string') {
          return sendError(res, 400, 'Invalid language preference');
        }
      }
    }

    const updateData = {
      enrolledCourse: mongoose.isValidObjectId(enrolledCourse) ? enrolledCourse : undefined,
      completedCourses: Array.isArray(completedCourses) ? completedCourses.filter(id => mongoose.isValidObjectId(id)) : undefined,
      certificates: Array.isArray(certificates) ? certificates.filter(id => mongoose.isValidObjectId(id)) : undefined,
      notifications: Array.isArray(notifications) ? notifications.filter(id => mongoose.isValidObjectId(id)) : undefined,
      resetPasswordOTP: typeof resetPasswordOTP === 'string' ? resetPasswordOTP : undefined,
      resetPasswordExpires: typeof resetPasswordExpires === 'number' ? resetPasswordExpires : undefined,
      profile: profile ? sanitize(profile) : undefined,
      updatedAt: new Date()
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (Object.keys(updateData).length === 0) {
      return sendError(res, 400, 'No valid data provided for update');
    }

    Object.assign(student, updateData);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
        .select('-password -refreshToken')
        .populate('enrolledCourse', 'title description')
        .populate('completedCourses', 'title description')
        .populate('certificates', 'title issuedAt')
        .populate('notifications', 'message createdAt');

    res.status(200).json({
      success: true,
      message: 'Student data updated successfully by admin',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error in updateStudentByAdmin:', error);
    sendError(res, 500, 'Error updating student data', error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Error deleting student', error);
  }
};

exports.getStudentEnrolledCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid student ID');
    }

    if (req.user.role === 'Student' && req.user.id !== req.params.id) {
      return sendError(res, 403, 'Students can only access their own data');
    }

    const student = await Student.findById(req.params.id)
        .select('enrolledCourse')
        .populate('enrolledCourse', 'title description');
    if (!student) {
      return sendError(res, 404, 'Student not found');
    }

    res.status(200).json({ success: true, data: student.enrolledCourse });
  } catch (error) {
    sendError(res, 500, 'Error fetching enrolled course', error);
  }
};