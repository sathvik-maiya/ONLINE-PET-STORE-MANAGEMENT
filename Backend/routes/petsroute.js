const express = require("express");
const { getallpets, createpet, getpetdetails, updatepetdetails, deletepet } = require("../controller/petscontroller");
const router = express.Router();

router.route("/pets").get(getallpets);
router.route("/pet/new").post(createpet);
router.route("/pet/:id").get(getpetdetails);
router.route("/pet/:id").put(updatepetdetails).delete(deletepet);


module.exports = router;
