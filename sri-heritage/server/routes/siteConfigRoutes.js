const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');

// @desc    Get site configuration
// @route   GET /api/site-config
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const config = await SiteConfig.findOne().populate('featuredPlaces');
    if (!config) {
      return res.status(404).json({ success: false, message: 'Site config not found' });
    }
    res.status(200).json({ success: true, config });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
