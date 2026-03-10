const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err)
}); 

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust")
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));   //req.body work because of this
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("heyy its working..")
});

//Index route
app.get("/listings", async(req,res)=>{
    const allListings = await Listing.find();
    res.render("listing/index.ejs", {allListings});
});

// New route
app.get("/listing/new", async(req,res)=>{
    res.render("listing/new.ejs");
});

//show route
app.get("/listing/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", {listing});
});
//Create route for upper new route
app.post("/listings", async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
//Edit listing
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing})
});
//Update route for upper one
app.put("/listing/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);  
});

//Delete route
app.delete("/listing/:id", async(req,res)=>{
    let {id} = req.params;
    let delteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080, ()=>{
    console.log("app is listening...")
});



