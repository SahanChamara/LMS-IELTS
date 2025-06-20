const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), submissionController.createSubmission);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), submissionController.getSubmissions);
router.get('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), submissionController.getSubmissionById);
router.put('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), submissionController.updateSubmission);
router.delete('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), submissionController.deleteSubmission);

module.exports = router;