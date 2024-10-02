const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
    },
    ratingAverage: {
      type: Number,
      default: 4.5
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
  }
  ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
      }
    ],
  },{
    
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

  tourSchema.pre(/^find/, function(next) {
    this
      .populate({ path: 'guides', select: '-__v -passwordChangedAt' })
      .populate({ path: 'reviews', select: '-__v' });
    next();
  }); 

  tourSchema.index({startLocation: '2dsphere'});

  tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
  });

  tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });


  const Tour = mongoose.model('Tour',tourSchema);
   
  module.exports = Tour;