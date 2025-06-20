const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), notificationController.createNotification);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), notificationController.getNotifications);
router.get('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), notificationController.getNotificationById);
router.put('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), notificationController.updateNotification);
router.delete('/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), notificationController.deleteNotification);

module.exports = router;