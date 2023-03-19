const Pettoy =  require("../models/Pettoymodel.js");
const ErrorHandler = require("../utils/errorhandler");
const cloudinary = require("cloudinary");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create pettoy -- Admin
exports.createpettoy = catchasyncerrors(async (req, res, next) => {
 let images = [];

 if (typeof req.body.images === "string") {
   images.push(req.body.images);
 } else {
   images = req.body.images;
 }

 const imagesLinks = [];

 for (let i = 0; i < images.length; i++) {
   const result = await cloudinary.v2.uploader.upload(images[i], {
     folder: "pettoy",
   });

   imagesLinks.push({
     public_id: result.public_id,
     url: result.secure_url,
   });
 }

 req.body.images = imagesLinks;
 req.body.user = req.user.id;

const pettoy = await Pettoy.create(req.body);

 res.status(201).json({
   success: true,
   pettoy,
 });
});

//Get all pettoy
exports.getallpettoy = catchasyncerrors(async (req, res, next) => {
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
  if (req.body.petClass.length != 0)
    filter.petClass = {
      $in: req.body.petClass,
    };
  const pettoy = await Pettoy.find(filter);
  res.status(200).json({
    success: true,
    pettoy,
  });
});

exports.getBrands = catchasyncerrors(async (req, res, next) => {
  const brands = await Pettoy.distinct("brand");
  res.status(200).json({
    success: true,
    brands: brands,
  });
});

exports.getPetClass = catchasyncerrors(async (req, res, next) => {
  const petClass = await Pettoy.distinct("petClass");
  res.status(200).json({
    success: true,
    petClass: petClass,
  });
});

//get single pettoy details
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

//update pettoy details--admin
exports.updatepettoydetails = catchasyncerrors(async (req, res, next) => {
  let pettoy = await Pettoy.findById(req.params.id);
  if (!pettoy) {
    return next(new ErrorHandler("pettoy not found", 404));
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
    for (let i = 0; i < pettoy.images.length; i++) {
      await cloudinary.v2.uploader.destroy(pettoy.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "pettoy",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
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


