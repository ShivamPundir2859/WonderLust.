const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listing = require("./routes/listing.js")

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err)
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust")
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));   //req.body work because of this
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("heyy its working..")
});



const validateReview = (req, res, next) => {       //joi validation(client side for Review)
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


app.use("/listings", listing);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;
    // res.status(statuscode).send(message);
    res.status(statuscode).render("Error.ejs", { message })
});

app.listen(8080, () => {
    console.log("app is listening...")
});


