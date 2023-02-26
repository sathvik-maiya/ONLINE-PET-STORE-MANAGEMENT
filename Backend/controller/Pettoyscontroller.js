const Pettoy =  require("../models/Pettoymodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create pettoy -- Admin
exports.createpettoy = catchasyncerrors(async (req, res, next) => {
    req.body.user = req.user.id;
  const pettoy = await Pettoy.create(req.body);
  res.status(201).json({
    success: true,
 pettoy,
  });
});

//Get all petfood
exports.getallpettoy = catchasyncerrors(async (req, res, next) => {
  const pettoy = await Pettoy.find();
  res.status(200).json({
    success: true,
 pettoy,
  });
});

//get single petfood details
exports.getpettoydetails = catchasyncerrors(async (req, res, next) => {
  let pettoy = await Pettoy.findById(req.params.id);
   if (!pettoy) {
     return next(new ErrorHandler("PetToys not found", 404));
   }

  res.status(200).json({
    success: true,
    pettoy,
  });
});

//update petfood details--admin
exports.updatepettoydetails = catchasyncerrors(async (req, res, next) => {
  let pettoy = await Pettoy.findById(req.params.id);
  if (!pettoy) {
    return next(new ErrorHandler("pettoy not found", 404));
  }
 pettoy = await Pettoy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
 pettoy,
  });
});



//delete pettoy--admin
exports.deletepettoy = catchasyncerrors(async (req, res, next) => {
  let pettoy = await Pettoy.findById(req.params.id);
  if (!pettoy) {
    return next(new ErrorHandler("PetToys not found", 404));
  }
 await pettoy.remove();
  res.status(200).json({
    success: true,
    message: "pettoys deleted successfully",
  });
});


// Create New Review or Update the review
exports.createpettoyreview = catchasyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const pettoy = await Pettoy.findById(productId);

  const isReviewed = pettoy.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    pettoy.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    pettoy.reviews.push(review);
    pettoy.numofreviews = pettoy.reviews.length;
  }

  let avg = 0;

  pettoy.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  pettoy.ratings = avg / pettoy.reviews.length;

  await pettoy.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getpettoyreviews = catchasyncerrors(async (req, res, next) => {
  const pettoy = await Pettoy.findById(req.query.id);

  if (!pettoy) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: pettoy.reviews,
  });
});

// Delete Review
exports.deletepettoyreview = catchasyncerrors(async (req, res, next) => {
  const pettoy = await Pettoy.findById(req.query.productId);

  if (!pettoy) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = pettoy.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numofreviews = reviews.length;

  await Pettoy.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numofreviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});