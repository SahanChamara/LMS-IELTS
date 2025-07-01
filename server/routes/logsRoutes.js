const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const logsController = require('../controllers/logsController');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin','Student']), logsController.createLog);
router.get('/', authMiddleware(['Instructor', 'SuperAdmin']), logsController.getLogs);
router.get('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), logsController.getLogById);
router.get('/user/:id', authMiddleware(['Instructor', 'SuperAdmin','Student']), logsController.getLastFiveUniqueUnitsByStudent);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), logsController.deleteLog);

module.exports = router;