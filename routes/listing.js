const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware.js");

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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listing/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Given listing doesn't Exist!!");
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listing/show.ejs", { listing });
}));

//Create route for upper new route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {    //ADD joi through validateListing
    const newListing = new Listing(req.body.listing);
    console.log(req.user)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!!");
    res.redirect("/listings");
})
);

//Edit listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Given listing doesn't Exist!!");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing })
}));

//Update route for upper one
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!!")
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    let delteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!")
    res.redirect("/listings");
});



module.exports = router;
