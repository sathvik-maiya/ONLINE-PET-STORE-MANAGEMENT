const express = require("express");
const {
  registeruser,
  loginuser,
  logout,
  getuserdetail,
  updateprofile,
  getallusers,
} = require("../controller/usercontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/logout").get(logout);
router.route("/me").get(isauthenticateduser, getuserdetail);
router.route("/me/update").put(isauthenticateduser, updateprofile);
router
  .route("/admin/users")
  .get(isauthenticateduser, authorizeroles("admin"), getallusers);

module.exports = router;
