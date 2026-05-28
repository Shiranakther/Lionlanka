const Chat = require('../models/Chat');

// @desc    Get all chat sessions for user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .select('-messages') // omit heavy messages for the list view
      .sort('-updatedAt');
      
    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update chat session
// @route   POST /api/chats
// @access  Private
exports.createOrUpdateChat = async (req, res, next) => {
  try {
    const { chatId, messages } = req.body;

    let chat;

    if (chatId) {
      // Update existing chat
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (!chat) {
         return res.status(404).json({ success: false, message: 'Chat not found' });
      }
      
      // If messages are passed, append them
      if (messages && Array.isArray(messages)) {
          // Push new messages (assuming client sends only new ones, or we just overwrite)
          // For simplicity let's assume client sends the full array to sync
          chat.messages = messages;
      }
      chat.updatedAt = Date.now();
      await chat.save();
    } else {
      // Create new chat
      if (!messages || messages.length === 0) {
          return res.status(400).json({ success: false, message: 'Messages required for new chat' });
      }
      
      // Title = first message truncated
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage ? firstUserMessage.content.substring(0, 50) : 'New Chat';

      chat = await Chat.create({
        userId: req.user.id,
        title,
        messages
      });
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat session
// @route   GET /api/chats/:id
// @access  Private
exports.getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chats/:id
// @access  Private
exports.deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    await chat.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chat deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin chat
// @route   PATCH /api/chats/:id/pin
// @access  Private
exports.togglePin = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });

    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    chat.isPinned = !chat.isPinned;
    await chat.save();

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    next(error);
  }
};
