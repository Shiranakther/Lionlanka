const SavedItem = require('../models/SavedItem');

// @desc    Get user's saved articles
// @route   GET /api/saved/articles
// @access  Private
exports.getSavedArticles = async (req, res, next) => {
  try {
    let saved = await SavedItem.findOne({ userId: req.user.id }).populate({
        path: 'articles.articleId',
        select: 'title slug excerpt coverImage category readingTime views likes createdAt author',
        populate: {
            path: 'author',
            select: 'name username profileImage'
        }
    });

    if (!saved) {
      saved = await SavedItem.create({ userId: req.user.id, articles: [], chats: [] });
    }

    // Filter out null articles (in case an article was deleted)
    const validArticles = saved.articles.filter(item => item.articleId != null);
    if(validArticles.length !== saved.articles.length) {
        saved.articles = validArticles;
        await saved.save();
    }

    res.status(200).json({
      success: true,
      articles: saved.articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save an article
// @route   POST /api/saved/articles/:id
// @access  Private
exports.saveArticle = async (req, res, next) => {
  try {
    let saved = await SavedItem.findOne({ userId: req.user.id });

    if (!saved) {
      saved = await SavedItem.create({ userId: req.user.id, articles: [], chats: [] });
    }

    // Check if already saved
    const exists = saved.articles.find(a => a.articleId.toString() === req.params.id);
    if (!exists) {
        saved.articles.push({ articleId: req.params.id });
        await saved.save();
    }

    res.status(200).json({
      success: true,
      articles: saved.articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a saved article
// @route   DELETE /api/saved/articles/:id
// @access  Private
exports.removeSavedArticle = async (req, res, next) => {
  try {
    const saved = await SavedItem.findOne({ userId: req.user.id });

    if (saved) {
        saved.articles = saved.articles.filter(a => a.articleId.toString() !== req.params.id);
        await saved.save();
    }

    res.status(200).json({
      success: true,
      message: 'Article removed from saved'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved chats
// @route   GET /api/saved/chats
// @access  Private
exports.getSavedChats = async (req, res, next) => {
  try {
    let saved = await SavedItem.findOne({ userId: req.user.id }).populate({
        path: 'chats.chatId',
        select: 'title isPinned createdAt updatedAt messages', // could omit messages for lightweight list
    });

    if (!saved) {
      saved = await SavedItem.create({ userId: req.user.id, articles: [], chats: [] });
    }
    
    // Filter out null chats
    const validChats = saved.chats.filter(item => item.chatId != null);
    if(validChats.length !== saved.chats.length) {
        saved.chats = validChats;
        await saved.save();
    }

    res.status(200).json({
      success: true,
      chats: saved.chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a chat
// @route   POST /api/saved/chats
// @access  Private
exports.saveChat = async (req, res, next) => {
  try {
      // Assuming chatId is in body for this one, or could use param
    const { chatId } = req.body;
    if(!chatId) return res.status(400).json({success:false, message: "chatId is required"});

    let saved = await SavedItem.findOne({ userId: req.user.id });

    if (!saved) {
      saved = await SavedItem.create({ userId: req.user.id, articles: [], chats: [] });
    }

    // Check if already saved
    const exists = saved.chats.find(c => c.chatId.toString() === chatId);
    if (!exists) {
        saved.chats.push({ chatId });
        await saved.save();
    }

    res.status(200).json({
      success: true,
      chats: saved.chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a saved chat
// @route   DELETE /api/saved/chats/:id
// @access  Private
exports.removeSavedChat = async (req, res, next) => {
  try {
    const saved = await SavedItem.findOne({ userId: req.user.id });

    if (saved) {
        saved.chats = saved.chats.filter(c => c.chatId.toString() !== req.params.id);
        await saved.save();
    }

    res.status(200).json({
      success: true,
      message: 'Chat removed from saved'
    });
  } catch (error) {
    next(error);
  }
};
