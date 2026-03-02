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
    // image: {
    //     type:String,
    //     default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop",
    //     set :(v) => v === "" ? "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8" : v,
    // },
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop",
    }},
    
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
