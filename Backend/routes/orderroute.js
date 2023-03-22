const express = require("express");
const {
  newOrder,} = require("../controller/ordercontroller");
const router = express.Router();

const { isauthenticateduser } = require("../middleware/auth");

router.route("/order/new").post(isauthenticateduser, newOrder);


module.exports = router;
