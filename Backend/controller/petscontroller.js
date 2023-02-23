const Pet = require("../models/petsmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create Pets -- Admin
exports.createpet = catchasyncerrors(async (req, res, next) => {
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