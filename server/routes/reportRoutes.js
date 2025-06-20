const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

const superAdminAuth = authMiddleware(['SuperAdmin']);

router.route('/')
  .post(superAdminAuth, reportController.createReport)
  .get(superAdminAuth, reportController.getAllReports);

router.route('/:id')
  .get(superAdminAuth, reportController.getReportById)
  .put(superAdminAuth, reportController.updateReport)
  .delete(superAdminAuth, reportController.deleteReport);

module.exports = router;