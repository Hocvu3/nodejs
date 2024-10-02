const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
// exports.getAllReviews = async (req, res) => {
//     let query;

//     if (req.params.tourId) {
//         query = { tour: req.params.tourId };
//     }
//     try {
//         const reviews = await Review.find({ ...query });
//         res.status(200).json({
//             status: 'success',
//             results: reviews.length,
//             data: {
//                 reviews
//             }
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// };

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};
exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);