const Petfood = require("../models/Petfoodmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");

// Create petfood -- Admin
exports.createPetfood = catchasyncerrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "petfood",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

const petfood = await Petfood.create(req.body);

  res.status(201).json({
    success: true,
    petfood,
  });
});

//Get all petfood
exports.getallPetfood = catchasyncerrors(async (req, res, next) => {
  const petfood = await Petfood.find();
  res.status(200).json({
    success: true,
    petfood,
  });
});

//get single petfood details
exports.getPetfooddetails = catchasyncerrors(async (req, res, next) => {
  let petfood = await Petfood.findById(req.params.id);
  if (!petfood) {
    return next(new ErrorHandler("petfood not found", 404));
  }

  res.status(200).json({
    success: true,
    petfood,
  });
});

//update petfood details--admin
exports.updatePetfooddetails = catchasyncerrors(async (req, res, next) => {
  let petfood = await Petfood.findById(req.params.id);
  if (!petfood) {
    return next(new ErrorHandler("petfood not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < petfood.images.length; i++) {
      await cloudinary.v2.uploader.destroy(petfood.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "petfood",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  petfood = await Petfood.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    petfood,
  });
});

//delete petfood--admin
exports.deletePetfood = catchasyncerrors(async (req, res, next) => {
  let petfood = await Petfood.findById(req.params.id);
  if (!petfood) {
    return next(new ErrorHandler("petfood not found", 404));
  }
  await petfood.remove();
  res.status(200).json({
    success: true,
    message: "petfood deleted successfully",
  });
});

// Create New Review or Update the review
exports.createpetfoodreview = catchasyncerrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const petfood = await Petfood.findById(productId);

  const isReviewed = petfood.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    petfood.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    petfood.reviews.push(review);
    petfood.numofreviews = petfood.reviews.length;
  }

  let avg = 0;

  petfood.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  petfood.ratings = avg / petfood.reviews.length;

  await petfood.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getpetfoodreviews = catchasyncerrors(async (req, res, next) => {
  const petfood = await Petfood.findById(req.query.id);

  if (!petfood) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: petfood.reviews,
  });
});

// Delete Review
exports.deletepetfoodreview = catchasyncerrors(async (req, res, next) => {
  const petfood = await Petfood.findById(req.query.productId);

  if (!petfood) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = petfood.reviews.filter(
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

  await Petfood.findByIdAndUpdate(
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
