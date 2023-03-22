const express = require("express");
const {
  registeruser,
  loginuser,
  logout,
  getuserdetail,
  updateprofile,
} = require("../controller/usercontroller");
const { isauthenticateduser } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/logout").get(logout);
router.route("/me").get(isauthenticateduser, getuserdetail);
router.route("/me/update").put(isauthenticateduser, updateprofile);

module.exports = router;
