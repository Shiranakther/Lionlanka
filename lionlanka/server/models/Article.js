const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide article content'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      validate: [val => val.length <= 3, 'Max 3 images allowed']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: [
          'Ancient History',
          'Kings & Rulers',
          'Buddhism & Religion',
          'Architecture',
          'Colonial Era',
          'Culture & Traditions',
          'Mythology',
          'Archaeology',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    historicalPeriod: {
      type: String,
      enum: {
        values: [
          'Prehistoric',
          'Anuradhapura Period',
          'Polonnaruwa Period',
          'Transitional Period',
          'Kandyan Period',
          'Colonial Period',
          'Modern Era',
        ],
        message: '{VALUE} is not a valid historical period',
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Article must have an author'],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readingTime: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['draft', 'in-review', 'published'],
      default: 'in-review',
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug, calculate reading time, and auto-generate excerpt before saving
ArticleSchema.pre('save', function (next) {
  // Generate slug from title
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString(36);
  }

  // Auto-calculate reading time based on word count (200 words per minute)
  if (this.isModified('content')) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    const wordCount = plainText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Auto-generate excerpt from content if not provided
    if (!this.excerpt) {
      const strippedContent = plainText.trim();
      this.excerpt =
        strippedContent.length > 200
          ? strippedContent.substring(0, 200) + '...'
          : strippedContent;
    }
  }

  next();
});

// Index for efficient querying
ArticleSchema.index({ category: 1, status: 1, createdAt: -1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ slug: 1 });

module.exports = mongoose.model('Article', ArticleSchema);
