const User = require('../models/User');
const Article = require('../models/Article');
const Place = require('../models/Place');
const Chat = require('../models/Chat');
const SiteConfig = require('../models/SiteConfig');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalChats = await Chat.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalArticles,
        totalPlaces,
        totalChats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = req.body.role || user.role;
    await user.save();
    res.status(200).json({ success: true, user: { id: user._id, role: user.role } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles
// @route   GET /api/admin/articles
// @access  Private/Admin
exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({}).populate('author', 'name username');
    res.status(200).json({ success: true, articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve article
// @route   PUT /api/admin/articles/:id/approve
// @access  Private/Admin
exports.approveArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    article.status = 'published';
    await article.save();
    res.status(200).json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any article
// @route   DELETE /api/admin/articles/:id
// @access  Private/Admin
exports.deleteAnyArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await article.deleteOne();
    res.status(200).json({ success: true, message: 'Article removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all places
// @route   GET /api/admin/places
// @access  Private/Admin
exports.getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find({});
    res.status(200).json({ success: true, places });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a place
// @route   POST /api/admin/places
// @access  Private/Admin
exports.createPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, place });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a place
// @route   PUT /api/admin/places/:id
// @access  Private/Admin
exports.updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    res.status(200).json({ success: true, place });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a place
// @route   DELETE /api/admin/places/:id
// @access  Private/Admin
exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    await place.deleteOne();
    res.status(200).json({ success: true, message: 'Place removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chats
// @route   GET /api/admin/chats
// @access  Private/Admin
exports.getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({}).populate('user', 'name username');
    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get site configuration
// @route   GET /api/admin/site-config
// @access  Private/Admin
exports.getSiteConfig = async (req, res, next) => {
  try {
    const config = await SiteConfig.findOne().populate('featuredPlaces');
    if (!config) {
      return res.status(404).json({ success: false, message: 'Site config not found' });
    }
    res.status(200).json({ success: true, config });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site configuration
// @route   PUT /api/admin/site-config
// @access  Private/Admin
exports.updateSiteConfig = async (req, res, next) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(req.body);
    } else {
      config = await SiteConfig.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, config });
  } catch (error) {
    next(error);
  }
};
