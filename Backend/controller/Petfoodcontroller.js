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
  var filter = {};
  if (req.body.price.length != 0)
    filter.price = {
      $gte: req.body.price[0],
      $lte: req.body.price[1],
    };
  if (req.body.brand.length != 0)
    filter.brand = {
      $in: req.body.brand,
    };

  if (req.body.flavor.length != 0)
    filter.flavor = {
      $in: req.body.flavor,
    };
  const petfood = await Petfood.find(filter);
  res.status(200).json({
    success: true,
    petfood,
  });
});

exports.getBrands = catchasyncerrors(async (req, res, next) => {
  const brands = await Petfood.distinct("brand");
  res.status(200).json({
    success: true,
    brands: brands,
  });
});

exports.getFlavors = catchasyncerrors(async (req, res, next) => {
  const flavors = await Petfood.distinct("flavor");
  res.status(200).json({
    success: true,
    flavors: flavors,
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
