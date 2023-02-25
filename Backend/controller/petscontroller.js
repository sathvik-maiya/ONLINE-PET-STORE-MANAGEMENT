const Pet = require("../models/petsmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create Pets -- Admin
exports.createpet = catchasyncerrors(async (req, res, next) => {
    req.body.user = req.user.id;
  const pet = await Pet.create(req.body);
  res.status(201).json({
    success: true,
    pet,
  });
});

//Get all pets
exports.getallpets = catchasyncerrors(async (req, res, next) => {
  const pets = await Pet.find();
  res.status(200).json({
    success: true,
    pets,
  });
});

//get single pet details
exports.getpetdetails = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
   if (!pet) {
     return next(new ErrorHandler("pet not found", 404));
   }

  res.status(200).json({
    success: true,
    pet,
  });
});

//update pet details--admin
exports.updatepetdetails = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
  if (!pet) {
    return next(new ErrorHandler("pet not found", 404));
  }
  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    pet,
  });
});



//delete pet--admin
exports.deletepet = catchasyncerrors(async (req, res, next) => {
  let pet = await Pet.findById(req.params.id);
  if (!pet) {
    return next(new ErrorHandler("pet not found", 404));
  }
 await pet.remove();
  res.status(200).json({
    success: true,
    message: "pet deleted successfully",
  });
});


// Create New Review or Update the review
exports.createpetreview = catchasyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const pet = await Pet.findById(productId);

  const isReviewed = pet.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    pet.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    pet.reviews.push(review);
    pet.numofreviews = pet.reviews.length;
  }

  let avg = 0;

  pet.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  pet.ratings = avg / pet.reviews.length;

  await pet.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getpetreviews = catchasyncerrors(async (req, res, next) => {
  const pet = await Pet.findById(req.query.id);

  if (!pet) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: pet.reviews,
  });
});

// Delete Review
exports.deletepetreview = catchasyncerrors(async (req, res, next) => {
  const pet = await Pet.findById(req.query.productId);

  if (!pet) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = pet.reviews.filter(
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

  await Pet.findByIdAndUpdate(
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