const express = require('express');
const router = express.Router();
const onlineSessionController = require('../controllers/onlineSessionController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), onlineSessionController.createSession);
router.get('/', authMiddleware(['Instructor', 'SuperAdmin']), onlineSessionController.getSession);
router.get('/unitId/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), onlineSessionController.getSessionByUnitId)
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), onlineSessionController.getSessionById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), onlineSessionController.updateSession);
router.delete('/:id', authMiddleware([ 'Instructor', 'SuperAdmin']), onlineSessionController.deleteSession);

module.exports = router;