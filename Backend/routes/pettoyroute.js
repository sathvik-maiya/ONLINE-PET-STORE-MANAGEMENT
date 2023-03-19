const express = require("express");
const {
  getallpettoy,
  createpettoy,
  updatepettoydetails,
  getpettoydetails,
  deletepettoy,
  getPetClass,
  getBrands,
} = require("../controller/pettoyscontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();


router.route("/pettoy").post(getallpettoy);
router.route("/pettoy/getbrands").get(getBrands);
router.route("/pettoy/getpetClass").get(getPetClass);
router
  .route("/admin/pettoy/new")
  .post(isauthenticateduser, authorizeroles("admin"), createpettoy);
router
  .route("/admin/pettoy/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updatepettoydetails)
  .delete(isauthenticateduser, authorizeroles("admin"), deletepettoy);
router.route("/pettoy/:id").get(getpettoydetails);
    

module.exports = router;
