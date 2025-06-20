const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), createCourse);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), getAllCourses);
router.get('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), getCourseById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), updateCourse);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), deleteCourse);

module.exports = router;