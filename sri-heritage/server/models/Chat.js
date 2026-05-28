const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: [true, 'Message role is required'],
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chat must belong to a user'],
    },
    title: {
      type: String,
      default: 'New Chat',
    },
    messages: [MessageSchema],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ChatSchema.index({ userId: 1, updatedAt: -1 });
ChatSchema.index({ userId: 1, isPinned: -1 });

module.exports = mongoose.model('Chat', ChatSchema);
