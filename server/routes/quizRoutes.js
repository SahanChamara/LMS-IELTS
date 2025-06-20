const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const quizController = require('../controllers/quizController');

router.post('/', authMiddleware(['Instructor', 'SuperAdmin']), quizController.createQuiz);
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), quizController.getQuizzes);
router.get('/assessment/:id', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), quizController.getQuizzes);
router.get('/:id', authMiddleware(['Instructor', 'SuperAdmin']), quizController.getQuizById);
router.put('/:id', authMiddleware(['Instructor', 'SuperAdmin']), quizController.updateQuiz);
router.delete('/:id', authMiddleware(['Instructor', 'SuperAdmin']), quizController.deleteQuiz);

module.exports = router;
