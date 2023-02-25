const express = require("express");
const { getallpettoy, createpettoy, updatepettoydetails, getpettoydetails, deletepettoy, createpettoyreview, getpettoyreviews, deletepettoyreview } = require("../controller/pettoyscontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();


router.route("/pettoy").get(getallpettoy);
router
  .route("/admin/pettoy/new")
  .post(isauthenticateduser, authorizeroles("admin"), createpettoy);
router
  .route("/admin/pettoy/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updatepettoydetails)
  .delete(isauthenticateduser, authorizeroles("admin"), deletepettoy);
router.route("/pettoy/:id").get(getpettoydetails);
    
  router.route("/pettoyreview").put(isauthenticateduser, createpettoyreview);

  router
    .route("/pettoyreviews")
    .get(getpettoyreviews)
    .delete(isauthenticateduser, deletepettoyreview);

module.exports = router;
