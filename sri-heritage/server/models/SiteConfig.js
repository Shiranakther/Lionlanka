const mongoose = require('mongoose');

const SiteConfigSchema = new mongoose.Schema(
  {
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    chatbotPromoTitle: { type: String },
    chatbotPromoSubtitle: { type: String },
    newsletterTitle: { type: String },
    newsletterSubtitle: { type: String },
    heroStats: [
      {
        label: { type: String },
        value: { type: String },
        icon: { type: String }
      }
    ],
    timelineEvents: [
      {
        year: { type: String },
        title: { type: String },
        description: { type: String },
      }
    ],
    featuredPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
