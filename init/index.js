require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const dbURL = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err)
});
async function main() {
    await mongoose.connect(dbURL, {
        serverSelectionTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
    })
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
