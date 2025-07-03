const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Create a new post (accessible to students, instructors, and admins)
router.post('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.createPost);

// Approve or reject a post (admin only)
router.put('/approve/:postId', authMiddleware(['SuperAdmin']), postController.approvePost);

// Delete a post (admin or post owner)
router.delete('/:postId', authMiddleware(['admin', 'student', 'instructor']), postController.deletePost);

// Add a reaction to a post (accessible to students, instructors, and admins)
router.post('/react/:postId', authMiddleware(['student', 'instructor', 'admin']), postController.reactPost);

// Add a comment to a post (accessible to students, instructors, and admins)
router.post('/comment/:postId', authMiddleware(['student', 'instructor', 'admin']), postController.commentPost);

// Get posts with optional filtering (accessible to students, instructors, and admins)
router.get('/', authMiddleware(['student', 'instructor', 'admin']), postController.getPosts);

module.exports = router;