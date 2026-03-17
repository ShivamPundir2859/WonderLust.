const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateListing = (req, res, next) => {       //joi validation(client side for newListing)
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {       //joi validation(client side for Review)
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listing/index.ejs", { allListings });
}));

// New route
router.get("/new", async (req, res) => {
    res.render("listing/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

//Create route for upper new route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {    //ADD joi through validateListing

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

//Edit listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing })
}));

//Update route for upper one
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let delteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Review Route
router.post("/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
