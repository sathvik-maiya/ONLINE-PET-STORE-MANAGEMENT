const express = require("express");
const {
  getallpets,
  createpet,
  getpetdetails,
  updatepetdetails,
  deletepet,
  getBreeds,
  getPetClass,
} = require("../controller/petscontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();

router.route("/pets").post(getallpets);
router.route("/pets/getbreeds").get(getBreeds);
router.route("/pets/getpetClass").get(getPetClass);
router
  .route("/admin/pet/new")
  .post(isauthenticateduser, authorizeroles("admin"), createpet);
router
  .route("/admin/pet/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updatepetdetails)
  .delete(isauthenticateduser, authorizeroles("admin"), deletepet);
router.route("/pet/:id").get(getpetdetails);

module.exports = router;
