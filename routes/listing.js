const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
// const {isOwner} = require("../middleware.jsmid");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../CloudConfig.js")
const upload = multer({ storage });


//Usage of router.route
router.route("/")
.get((listingController.index))
// .post(validateListing,isLoggedIn ,(listingController.createListing));
.post(upload.single("listing[image]"),(req,res)=>{
    res.send(req.file);
})
// New Route
 router.get("/new",isLoggedIn,(listingController.renderNewForm))
router.route("/:id")
.get( (listingController.showListing))
.put(validateListing,isLoggedIn,isOwner,(listingController.updateListing))
.delete( isLoggedIn,isOwner,(listingController.destroyListing));
//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,(listingController.renderEditForm))

module.exports = router;