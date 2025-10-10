const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.post('/sendRegisterDetail',authMiddleware(['SuperAdmin']),adminController.sendRegisteredDetailsEmail);

module.exports = router;