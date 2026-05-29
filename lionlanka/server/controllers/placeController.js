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

// @desc    Lookup exact coordinates by place name
// @route   POST /api/places/coordinates-lookup
// @access  Public
exports.coordinatesLookup = async (req, res, next) => {
  try {
    const { names } = req.body;

    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ success: false, message: 'names array is required' });
    }

    const results = {};

    for (const name of names) {
      // Try exact match first, then case-insensitive regex
      let place = await Place.findOne(
        { name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'i') } },
        { name: 1, 'location.coordinates': 1 }
      );

      // If no exact match, try partial/fuzzy match
      if (!place) {
        const words = name.trim().split(/\s+/).filter(w => w.length > 2);
        if (words.length > 0) {
          const pattern = words.map(w => w.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('.*');
          place = await Place.findOne(
            { name: { $regex: new RegExp(pattern, 'i') } },
            { name: 1, 'location.coordinates': 1 }
          );
        }
      }

      if (place && place.location?.coordinates?.lat && place.location?.coordinates?.lng) {
        results[name] = {
          lat: place.location.coordinates.lat,
          lng: place.location.coordinates.lng,
          dbName: place.name
        };
      }
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    next(error);
  }
};
