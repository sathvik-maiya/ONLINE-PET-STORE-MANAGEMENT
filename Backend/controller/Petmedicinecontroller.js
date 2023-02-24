const Petmedicine = require("../models/Petmedicinemodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");

// Create petmedicine -- Admin
exports.createpetmedicine = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.create(req.body);
  res.status(201).json({
    success: true,
 petmedicine,
  });
});

//Get all petfood
exports.getallpetmedicine = catchasyncerrors(async (req, res, next) => {
  const petmedicine = await Petmedicine.find();
  res.status(200).json({
    success: true,
 petmedicine,
  });
});

//get single petfood details
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

//update petfood details--admin
exports.updatepetmedicinedetails = catchasyncerrors(async (req, res, next) => {
  let petmedicine = await Petmedicine.findById(req.params.id);
  if (!petmedicine) {
    return next(new ErrorHandler("petmedicine not found", 404));
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



//delete petfood--admin
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