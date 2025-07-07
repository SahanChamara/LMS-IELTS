const mongoose = require('mongoose');
const Post = require('../models/Post');

// Create a new post with nested objects
const createPost = async (req, res) => {
    try {
        const { textContent, attachments, visibility, userId, userName, userRole, reactions, comments } = req.body;

        const post = new Post({
            textContent,
            attachments: attachments || [], // Expect an array of attachment objects
            visibility,
            userId,
            userName,
            userRole,
            status: 'pending',
            reactions: reactions || [], // Expect an array of reaction objects
            comments: comments || [] // Expect an array of comment objects
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

// Approve a post (admin only)
const approvePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

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

// Delete a post
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // No need to delete separate Comment/Reaction collections, as they are embedded
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

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const reaction = {
            type,
            userId,
            userName,
            createdAt: new Date()
        };

        post.reactions.push(reaction);
        const updatedPost = await post.save();

        res.status(201).json(updatedPost.reactions[updatedPost.reactions.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding reaction', error: error.message });
    }
};

// Add a comment to a post
const commentPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, userId, userName, userRole } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            content,
            userId,
            userName,
            userRole,
            createdAt: new Date()
        };

        post.comments.push(comment);
        const updatedPost = await post.save();

        res.status(201).json(updatedPost.comments[updatedPost.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

// Get posts with optional filtering
const getPosts = async (req, res) => {
    try {
        const { visibility, status, userId, page = 1, limit = 10 } = req.query;

        const query = {};
        if (visibility) query.visibility = visibility;
        if (status) query.status = status;
        if (userId) query.userId = userId;

        const posts = await Post.find(query)
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

module.exports = {
    createPost,
    approvePost,
    deletePost,
    reactPost,
    commentPost,
    getPosts
};