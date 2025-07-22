const mongoose = require('mongoose');
const Post = require('../models/Post');

// Create a new post
const createPost = async (req, res) => {
    try {
        const { textContent, attachments, visibility, course, userId, userName, userRole } = req.body;

        console.log(req.body);
        if (!userId || !userName || !userRole || !course) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const post = new Post({
            textContent,
            attachments: attachments || [],
            visibility: visibility || 'public',
            course,
            userId,
            userName,
            userRole,
            status: 'pending',
            reactions: [],
            comments: []
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

// Approve or reject a post (admin only)
const approvePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.status = status;
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post status', error: error.message });
    }
};

// Delete a post (admin or post owner)
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const user = req.user; // Assumes authMiddleware adds user to req

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is post owner or admin
        if (post.userId !== user.userId && !user.roles.includes('SuperAdmin')) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await Post.deleteOne({ _id: postId });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

// Add a reaction to a post
const reactPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { type, userId, userName } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        if (!type || !userId || !userName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const validReactionTypes = ['like', 'love', 'helpful', 'dislike'];
        if (!validReactionTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check for existing reaction from the same user
        const existingReaction = post.reactions.find(r => r.userId === userId);
        if (existingReaction) {
            return res.status(400).json({ message: 'User already has a reaction. Use update or remove.' });
        }

        // Add new reaction
        const reaction = {
            postId,
            type,
            userId,
            userName,
            createdAt: new Date()
        };
        post.reactions.push(reaction);
        const updatedPost = await post.save();

        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error adding reaction', error: error.message });
    }
};

// Remove a reaction from a post
const removeReaction = async (req, res) => {
    try {
        console.log("Removing reaction for postId:", req.params.postId, "userId:", req.body);
        const { postId } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check for existing reaction
        const reactionIndex = post.reactions.findIndex(r => r.userId === userId);
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'No reaction found for this user' });
        }

        // Remove the reaction
        post.reactions.splice(reactionIndex, 1);
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error removing reaction', error: error.message });
    }
};

// Update a user's reaction type for a post
const updateReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const { type, userId, userName } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        if (!type || !userId || !userName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const validReactionTypes = ['like', 'love', 'helpful', 'dislike'];
        if (!validReactionTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the existing reaction
        const reactionIndex = post.reactions.findIndex(r => r.userId === userId);
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'No existing reaction found for this user' });
        }

        // Update the reaction type
        post.reactions[reactionIndex].type = type;
        post.reactions[reactionIndex].createdAt = new Date();
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reaction', error: error.message });
    }
};

// Add a comment to a post
const commentPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, userId, userName, userRole } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        if (!content || !userId || !userName || !userRole) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = { content, userId, userName, userRole, createdAt: new Date() };
        post.comments.push(comment);
        const updatedPost = await post.save();

        res.status(201).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

// Get posts with optional filtering
const getPosts = async (req, res) => {
    try {
        const { visibility, status, userId, course, page = 1, limit = 10 } = req.query;

        const query = {};
        if (visibility) query.visibility = visibility;
        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (course) query.course = course;

        const posts = await Post.find(query)
            .populate('course', 'title')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

// Get posts by course ID
const getPostsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { visibility, status, userId, page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const query = { course: courseId };
        if (visibility) query.visibility = visibility;
        if (status) query.status = status;
        if (userId) query.userId = userId;

        const posts = await Post.find(query)
            .populate('course', 'title')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts by course', error: error.message });
    }
};

module.exports = {
    createPost,
    approvePost,
    deletePost,
    reactPost,
    removeReaction,
    updateReaction,
    commentPost,
    getPosts,
    getPostsByCourseId
};