const express = require("express");
const {
  newOrder,
  getsingleorder,
  myorders,
  getallorders,
  deleteorder,
} = require("../controller/ordercontroller");
const router = express.Router();

const { isauthenticateduser, authorizeroles } = require("../middleware/auth");

router.route("/order/new").post(isauthenticateduser, newOrder);

router.route("/order/:id").get(isauthenticateduser, getsingleorder);

router.route("/orders/me").get(isauthenticateduser, myorders);

router
  .route("/admin/orders")
  .get(isauthenticateduser, authorizeroles("admin"), getallorders);

router
  .route("/admin/order/:id")
  .delete(isauthenticateduser, authorizeroles("admin"), deleteorder);

module.exports = router;
