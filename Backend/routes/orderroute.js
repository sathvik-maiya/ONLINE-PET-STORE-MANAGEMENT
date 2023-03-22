const express = require("express");
const { newOrder ,myorders} = require("../controller/ordercontroller");
const router = express.Router();
const { isauthenticateduser } = require("../middleware/auth");

router.route("/order/new").post(isauthenticateduser, newOrder);

router.route("/orders/me").get(isauthenticateduser, myorders);


module.exports = router;
