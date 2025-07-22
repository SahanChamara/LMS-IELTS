const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Attachment subdocument schema
const AttachmentSchema = new Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    url: { type: String, required: true, trim: true }
});

// Reaction subdocument schema
const ReactionSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // Added postId field
    type: {
        type: String,
        required: true,
        enum: ['like', 'love', 'helpful', 'dislike'], // Define allowed reaction types
        trim: true
    },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Comment subdocument schema
const CommentSchema = new Schema({
    content: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userRole: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

// Post schema
const PostSchema = new Schema({
    textContent: { type: String, trim: true },
    attachments: [AttachmentSchema],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    userId: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    userRole: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        required: true
    },
    reactions: [ReactionSchema],
    comments: [CommentSchema]
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
PostSchema.index({ course: 1, createdAt: -1 });
PostSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Post', PostSchema);