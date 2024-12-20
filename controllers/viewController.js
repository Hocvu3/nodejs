const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getOverview = catchAsync( async (req, res) => {
    //get data
    const tours = await Tour.find();
    //build template
    //render taht template
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});
    
exports.getTour =  async(req, res, next) => {
    //get data
    // console.log(req.params.slug);
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    if(!tour) {
        return next(new AppError('There is no tour with that name', 404));
    };
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
};
    
    exports.getLoginForm = (req, res) => {
        res.status(200).render('login', {
            title: 'Log into your account',
        });
    };
    
    exports.getAccount = (req, res) => {
        res.status(200).render('account', {
            title: 'Your account',
        });
    };
    