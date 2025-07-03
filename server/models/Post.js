const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Attachment schema as a subdocument
const AttachmentSchema = new Schema({
    // Name of the file
    name: { type: String, required: true },
    // MIME type of the file (e.g., 'application/pdf', 'image/png')
    type: { type: String, required: true },
    // Size of the file in bytes
    size: { type: Number, required: true },
    // URL to access the file (assumed to be stored in a cloud storage like S3)
    url: { type: String, required: true }
});

// Define Reaction schema as a subdocument
const ReactionSchema = new Schema({
    // Type of reaction (e.g., 'like', 'love', 'helpful')
    type: { type: String, required: true },
    // User who made the reaction
    userId: { type: String, required: true },
    // Name of the user for display purposes
    userName: { type: String, required: true },
    // Timestamp for reaction creation
    createdAt: { type: Date, default: Date.now }
});

// Define Comment schema as a subdocument
const CommentSchema = new Schema({
    // Text content of the comment
    content: { type: String, required: true },
    // User who made the comment
    userId: { type: String, required: true },
    // Name of the user for display purposes
    userName: { type: String, required: true },
    // Role of the user for display purposes
    userRole: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    // Timestamp for comment creation
    createdAt: { type: Date, default: Date.now }
});

const Post = new Schema({
    // Text content of the post
    textContent: { type: String },
    // Array of embedded attachments
    attachments: [AttachmentSchema],
    // Visibility of the post (e.g., 'public', 'private')
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    // Status of the post (e.g., 'pending', 'approved', 'rejected')
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    userId: { type: String, required: true },
    // Name of the user for display purposes
    userName: { type: String, required: true },
    // Role of the user for display purposes
    userRole: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    // Timestamp for post creation
    createdAt: { type: Date, default: Date.now },
    // Array of embedded reactions
    reactions: [ReactionSchema],
    // Array of embedded comments
    comments: [CommentSchema]
});

module.exports = mongoose.model('Post', Post);