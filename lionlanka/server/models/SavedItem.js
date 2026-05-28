const mongoose = require('mongoose');

const SavedItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Saved items must belong to a user'],
      unique: true,
    },
    articles: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Article',
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chats: [
      {
        chatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chat',
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for fast user lookup
SavedItemSchema.index({ userId: 1 });

module.exports = mongoose.model('SavedItem', SavedItemSchema);
