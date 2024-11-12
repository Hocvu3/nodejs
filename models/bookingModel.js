const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price.']
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    next();
});

bookingSchema.statics.calcCommission = async function(tourId) {
        const stats = await this.aggregate([
            {
                $match: {tour: tourId}
            },
            {
                $group: {
                    _id: '$tour',
                    nBookings: {$sum: 1},
                    totalCommission: {$sum: '$price'}
                }
            }
        ]);
        console.log(stats);
        if(stats.length > 0) {
            await Tour.findByIdAndUpdate(tourId, {
                commissionQuantity: stats[0].nBookings,
                commissionAverage: stats[0].totalCommission
            });
        }
    }

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;