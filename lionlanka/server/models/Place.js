const mongoose = require('mongoose');
const slugify = require('slugify');

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a place name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    historicalSignificance: {
      type: String,
    },
    location: {
      province: {
        type: String,
      },
      coordinates: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
    },
    images: [
      {
        type: String,
      },
    ],
    timeline: [
      {
        year: {
          type: String,
        },
        event: {
          type: String,
        },
      },
    ],
    visitingHours: {
      type: String,
    },
    entryFee: {
      type: String,
    },
    relatedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    historicalPeriod: {
      type: String,
    },
    category: {
      type: String,
      enum: {
        values: [
          'Ancient City',
          'Temple',
          'Fortress',
          'Colonial',
          'Natural Heritage',
          'Museum',
        ],
        message: '{VALUE} is not a valid place category',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
PlaceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug =
      slugify(this.name, { lower: true, strict: true }) +
      '-' +
      Date.now().toString(36);
  }
  next();
});

// Indexes
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ slug: 1 });
PlaceSchema.index({ 'location.province': 1 });

module.exports = mongoose.model('Place', PlaceSchema);
