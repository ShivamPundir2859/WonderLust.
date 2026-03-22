const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err)
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust")
};

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "69bceb44e9c96c2714a0718c",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data is inserted");
};
initDB();
