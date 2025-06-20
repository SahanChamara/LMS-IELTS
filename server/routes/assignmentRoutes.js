const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), assignmentController.createAssignment);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assignmentController.getAssignments);
router.get('/unit/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assignmentController.getAssignmentsByUnitId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentController.getAssignmentById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentController.updateAssignment);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assignmentController.deleteAssignment);

module.exports = router;