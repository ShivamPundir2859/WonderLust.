const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { validateReview, isOwner, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

//Review Route
router.post("/", validateReview, wrapAsync(reviewController.createReview));

// Delete Review route
router.delete("/:reviewId", isOwner, isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;