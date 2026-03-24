const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // image: {
    //     type:String,
    //     default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop",
    //     set :(v) => v === "" ? "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8" : v,
    // },
    image: {
        url: String,
        filename: String
    },

    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    };
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;



