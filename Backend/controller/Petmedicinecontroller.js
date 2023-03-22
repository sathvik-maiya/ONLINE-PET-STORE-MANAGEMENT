const Petmedicine = require("../models/Petmedicinemodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");

// Create petmedicine -- Admin
exports.createpetmedicine = catchasyncerrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "petmedicine",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const petmedicine = await Petmedicine.create(req.body);

  res.status(201).json({
    success: true,
    petmedicine,
  });
});

//Get all petmedicine
exports.getallpetmedicine = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.find();
  res.status(200).json({
    success: true,
    petmedicine,
  });
});

//get single petmedicine details
exports.getpetmedicinedetails = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
  }

  res.status(200).json({
    success: true,
    petmedicine,
  });
});

//update petmedicine details--admin
exports.updatepetmedicinedetails = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
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
    for (let i = 0; i < petmedicine.images.length; i++) {
      await cloudinary.v2.uploader.destroy(petmedicine.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "petmedicine",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  petmedicine = await Petmedicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    petmedicine,
  });
});

//delete petmedcine--admin
exports.deletepetmedicine = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
  }
  await petmedicine.remove();
  res.status(200).json({
    success: true,
    message: "petmedicine deleted successfully",
  });
});
