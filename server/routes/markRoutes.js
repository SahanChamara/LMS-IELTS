const express = require('express');
const router = express.Router();
const MarksController = require('../controllers/markController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), MarksController.createMark);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), MarksController.getMark);
router.get('/student/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), MarksController.getMarkByStudentId);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), MarksController.getMarkById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), MarksController.updateMark);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), MarksController.deleteMark);


module.exports = router;