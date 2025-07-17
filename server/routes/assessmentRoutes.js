const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), assessmentController.createAssessment);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assessmentController.getAssessments);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentController.getAssessmentById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentController.updateAssessment);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentController.deleteAssessment);
router.get('/unit/:unitId', authMiddleware(['Instructor', 'SuperAdmin']), assessmentController.getAssessmentsByUnitId);

module.exports = router;