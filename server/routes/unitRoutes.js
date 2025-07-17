const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['SuperAdmin', 'Instructor']), unitController.createUnit);
router.get('/', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), unitController.getAllUnits);
router.get('/:id', authMiddleware(['SuperAdmin', 'Instructor','Student']), unitController.getUnitById);
router.put('/:id', authMiddleware(['SuperAdmin', 'Instructor']), unitController.updateUnit);
router.delete('/:id', authMiddleware(['SuperAdmin', 'Instructor']), unitController.deleteUnit);
router.post('/:id/subUnit', authMiddleware(['SuperAdmin', 'Instructor']), unitController.addSubUnit);
router.post('/:id/lesson', authMiddleware(['SuperAdmin', 'Instructor']), unitController.addLesson);
router.post('/:id/assessment', authMiddleware(['SuperAdmin', 'Instructor']), unitController.addAssessment);
router.post('/:id/exam', authMiddleware(['SuperAdmin', 'Instructor']), unitController.addExam);
router.post('/:id/studyMaterial', authMiddleware(['SuperAdmin', 'Instructor']), unitController.addStudyMaterial);
// router.post('/:id/discussion', authMiddleware(['SuperAdmin', 'Instructor', 'Student']), unitController.addDiscussion);

//=========================================================================================
router.get('/:id/units', authMiddleware(['SuperAdmin', 'Instructor']), unitController.getAllUnitsByInstructor);
//=========================================================================================

module.exports = router;