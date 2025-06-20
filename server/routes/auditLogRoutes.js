const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['SuperAdmin']), auditLogController.createAuditLog);
router.get('/', authMiddleware(['SuperAdmin']), auditLogController.getAuditLogs);
router.get('/:id', authMiddleware(['SuperAdmin']), auditLogController.getAuditLogById);
router.put('/:id', authMiddleware(['SuperAdmin']), auditLogController.updateAuditLog);
router.delete('/:id', authMiddleware(['SuperAdmin']), auditLogController.deleteAuditLog);

module.exports = router;