const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    let queryStr = { status: 'published' };
    
    if (req.query.category) {
        queryStr.category = req.query.category;
    }
    if (req.query.historicalPeriod) {
        queryStr.historicalPeriod = req.query.historicalPeriod;
    }

    if (req.query.search) {
      queryStr.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    let query = Article.find(queryStr).populate('author', 'name username profileImage');

    // Sort
    if (req.query.sort) {
        if(req.query.sort === 'Most Viewed') {
            query = query.sort('-views');
        } else if(req.query.sort === 'Most Liked') {
             query = query.sort('-likes');
        } else {
             query = query.sort('-createdAt');
        }
    } else {
      query = query.sort('-createdAt');
    }

    const total = await Article.countDocuments(queryStr);
    
    query = query.skip(startIndex).limit(limit);
    const articles = await query;

    res.status(200).json({
      success: true,
      articles,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate('author', 'name username profileImage');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
exports.createArticle = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    
    if(req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    if (req.files) {
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        req.body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
      if (req.files.images && req.files.images.length > 0) {
        req.body.images = req.files.images.map(file => `/uploads/${file.filename}`);
      }
    }

    if (req.user.role !== 'admin') {
      req.body.status = 'in-review';
    }

    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check ownership
    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this article' });
    }

    if(req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    if (req.files) {
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        req.body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
      if (req.files.images && req.files.images.length > 0) {
        req.body.images = req.files.images.map(file => `/uploads/${file.filename}`);
      }
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this article' });
    }

    await Article.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Article deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Like an article
// @route   POST /api/articles/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const index = article.likes.indexOf(req.user.id);
    
    if (index === -1) {
        article.likes.push(req.user.id);
    } else {
        article.likes.splice(index, 1);
    }

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      likes: article.likes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's articles
// @route   GET /api/articles/user/mine
// @access  Private
exports.getMyArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ author: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by ID
// @route   GET /api/articles/id/:id
// @access  Public
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name username profileImage');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};
