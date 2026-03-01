const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image: {
        type:String,
        default: "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8",
        set :(v) => v === "" ? "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8" : v,
    },
    price: {
        type: Number
    },
    location:{
        type: String
    },
    country:{
        type: String
    },
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
