const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), examController.createExam);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), examController.getExams);
router.get('/unitId/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), examController.getExamByUnitId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examController.getExamById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examController.updateExamById);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), examController.deleteExam);

module.exports = router;