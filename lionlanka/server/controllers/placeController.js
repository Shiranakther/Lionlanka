const Place = require('../models/Place');

// @desc    Get all places
// @route   GET /api/places
// @access  Public
exports.getPlaces = async (req, res, next) => {
  try {
    let queryStr = {};
    
    if (req.query.category) {
        queryStr.category = req.query.category;
    }

    if (req.query.search) {
      queryStr.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const places = await Place.find(queryStr).sort('name');

    res.status(200).json({
      success: true,
      places,
      count: places.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place
// @route   GET /api/places/:slug
// @access  Public
exports.getPlace = async (req, res, next) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug }).populate('relatedArticles', 'title slug coverImage');

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    res.status(200).json({
      success: true,
      place
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create place
// @route   POST /api/places
// @access  Private/Admin
exports.createPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);

    res.status(201).json({
      success: true,
      place
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update place
// @route   PUT /api/places/:id
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

    res.status(200).json({
      success: true,
      place
    });
  } catch (error) {
    next(error);
  }
};
