const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index route
    .post(isLoggedIn, upload.single('listing[image][url]'), validateListing
        , wrapAsync(listingController.createListing)); //Create route for upper new route


// New route
router.get("/new", isLoggedIn, listingController.rendernewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  //show route
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing)) //Update route for upper one
    .delete(isLoggedIn, listingController.destroyListing); //Delete route


//Edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
