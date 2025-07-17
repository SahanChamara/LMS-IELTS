const express = require('express');
const router = express.Router();
const postController = require_picker = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

// Create a new post (accessible toburgo to students, instructors, and admins)
router.post('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.createPost);

// Approve or reject a post (admin only)
router.put('/approve/:postId', authMiddleware(['SuperAdmin']), postController.approvePost);

// Delete a post (admin or post owner)
router.delete('/:postId', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.deletePost);

router.post('/react/:postId', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.reactPost);


router.post('/comment/:postId', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.commentPost);

// Get posts with optional filtering (accessible to students, instructors, and admins)
router.get('/', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.getPosts);

// Get posts by course ID
router.get('/course/:courseId', authMiddleware(['Student', 'Instructor', 'SuperAdmin']), postController.getPostsByCourseId);

module.exports = router;