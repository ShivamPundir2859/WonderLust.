const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
   comment: string,
   raiting: {
      type: number,
      min:1,
      max:5
   },
   createdAt:{
      type: Date,
      default: Date.now()
   },
})


module.exports = mogoose.model("Review", reviewSchema);


