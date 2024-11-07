// const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIfeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { path } = require("../app");
const handlerFactory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8")
//   );

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer(
  {
    storage: multerStorage,
    fileFilter: multerFilter,
  }
);

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
  });

exports.checkID = (req, res, next, val) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  // next();
};

exports.checkBody = (req, res, next) => {
  // if (!req.body.name || !req.body.price) {
  //   return res.status(400).json({
  //     status: "fail",
  //     message: "Missing name or price",
  //   });
  // }
  // next();
};
exports.getMontlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: "success",  
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
    });
  }
}
exports.getTourStats = catchAsync(async (req, res,next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.0 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { 
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: "EASY" } },
      // }, // ne = not equal
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
});

// exports.getTour = catchAsync(async (req, res,next) => {
//     const tours = await Tour.findById(req.params.id).populate(
//       {path: 'guides', select: '-__v -passwordChangedAt'}
//     );

//     if(!tours){
//         return next(new AppError('No tour found with that ID',404));
//     };
//     res.status(200).json({
//       status: "success",
//       result: tours.length,
//       data: {
//         tours,
//       },
//     });
// });

exports.getToursWithin = catchAsync(async (req, res,next) => {
  const {distance, latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng){
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  // console.log(distance, lat, lng, unit);
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res,next) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(','); 

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng){
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});

exports.createTour = handlerFactory.createOne(Tour);
exports.getAllTours = handlerFactory.getAll(Tour);
exports.getTour = handlerFactory.getOne(Tour,{path: 'reviews'});
exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);