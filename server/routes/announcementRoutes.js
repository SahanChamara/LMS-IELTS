const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/auth');

router.post('/',authMiddleware(['Instructor','SuperAdmin']),announcementController.createAnnouncement);
router.get('/',authMiddleware(['SuperAdmin']), announcementController.getAnnouncement);
router.get('/course/:id',authMiddleware(['Instructor','Student','SuperAdmin']),announcementController.getAnnouncementByCourseId);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), announcementController.deleteAnnouncement);

module.exports = router;