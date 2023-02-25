const express = require("express");
const { getallPetfood, createPetfood, getPetfooddetails, updatePetfooddetails, deletePetfood, createpetfoodreview, getpetfoodreviews, deletepetfoodreview } = require("../controller/Petfoodcontroller");
const { isauthenticateduser, authorizeroles } = require("../middleware/auth");
const router = express.Router();

router.route("/petfood").get(getallPetfood);
router
  .route("/admin/petfood/new")
  .post(isauthenticateduser, authorizeroles("admin"), createPetfood);
router
  .route("/admin/petfood/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updatePetfooddetails)
  .delete(isauthenticateduser, authorizeroles("admin"), deletePetfood);
router.route("/petfood/:id").get(getPetfooddetails);
    
  router.route("/petfoodreview").put(isauthenticateduser, createpetfoodreview);

  router
    .route("/petfoodreviews")
    .get(getpetfoodreviews)
    .delete(isauthenticateduser, deletepetfoodreview);


module.exports = router;
