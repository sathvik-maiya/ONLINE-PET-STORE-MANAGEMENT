const Pettoy = require("../models/Pettoymodel.js");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");


// Create pettoy -- Admin
exports.createpettoy = catchasyncerrors(async (req, res, next) => {
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



//delete petfood--admin
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