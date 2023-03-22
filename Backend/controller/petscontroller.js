const Pet = require("../models/petsmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");

// Create Pets -- Admin
exports.createpet = catchasyncerrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "pet",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const pet = await Pet.create(req.body);

  res.status(201).json({
    success: true,
    pet,
  });
});

//Get all pets
exports.getallpets = catchasyncerrors(async (req, res, next) => {
  var filter = {};
  if (req.body.price.length != 0)
    filter.price = {
      $gte: req.body.price[0],
      $lte: req.body.price[1],
    };
  if (req.body.breed.length != 0)
    filter.breed = {
      $in: req.body.breed,
    };

  if (req.body.petClass.length != 0)
    filter.petClass = {
      $in: req.body.petClass,
    };
  const pets = await Pet.find(filter);
  res.status(200).json({
    success: true,
    pets,
  });
});

exports.getBreeds = catchasyncerrors(async (req, res, next) => {
  const breeds = await Pet.distinct("breed");
  res.status(200).json({
    success: true,
    breeds: breeds,
  });
});

exports.getPetClass = catchasyncerrors(async (req, res, next) => {
  const petClass = await Pet.distinct("petClass");
  res.status(200).json({
    success: true,
    petClass: petClass,
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

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < pet.images.length; i++) {
      await cloudinary.v2.uploader.destroy(pet.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "pet",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
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
