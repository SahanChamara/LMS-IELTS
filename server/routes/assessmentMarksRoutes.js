const express = require('express');
const router = express.Router();
const assessmentMarksController = require('../controllers/assessmentMarksController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), assessmentMarksController.createMark);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assessmentMarksController.getMark);
router.get('/student/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), assessmentMarksController.getMarkByStudentId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentMarksController.getMarkById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentMarksController.updateMark);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), assessmentMarksController.deleteMark);

module.exports = router;