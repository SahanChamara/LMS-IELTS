const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authMiddleware(['SuperAdmin']), studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/', authMiddleware(['SuperAdmin', 'Instructor']), studentController.getAllStudents);
router.get('/:id', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.getStudentById);
router.put('/:id', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.updateStudent);
router.put('/:id/admin', authMiddleware(['SuperAdmin', 'Instructor']), studentController.updateStudentByAdmin);
router.delete('/:id', authMiddleware(['SuperAdmin', 'Instructor']), studentController.deleteStudent);
router.get('/:id/enrolled-course', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), studentController.getStudentEnrolledCourse);

module.exports = router;