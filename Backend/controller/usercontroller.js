const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");
const User = require("../models/usermodel");
const sendtoken = require("../utils/jwttoke");

//register a user
exports.registeruser = catchasyncerrors(async (req, res, next) => {
  const { name, email, password, phonenumber } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    phonenumber,
  });
  sendtoken(user, 201, res);
});

//login user
exports.loginuser = catchasyncerrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendtoken(user, 200, res);
});

//logout user
exports.logout = catchasyncerrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

//get user details
exports.getuserdetail = catchasyncerrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update User Profile
exports.updateprofile = catchasyncerrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
  };
  if (req.body.name || req.body.email || req.body.phonenumber) {
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  }
  res.status(200).json({
    success: true,
  });
});


//get all users(admin)
exports.getallusers = catchasyncerrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});