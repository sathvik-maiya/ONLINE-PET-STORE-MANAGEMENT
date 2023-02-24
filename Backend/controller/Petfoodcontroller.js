const Petfood = require("../models/Petfoodmodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create petfood -- Admin
exports.createPetfood = catchasyncerrors(async (req, res, next) => {
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
    return next(new ErrorHandler("pet not found", 404));
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