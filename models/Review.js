const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "please provide raiting "],
  },
  title: {
    type: String,
    trim: true,
    required: [true, "please provide review title "],
    maxlength: 100,
  },
  comment: {
    type: String,
    trim: true,
    required: [true, "please provide review text "],
  },
  user:{
      type: mongoose.Schema.ObjectId,
      ref:"User",
      required:true,
  },
  product:{
      type: mongoose.Schema.ObjectId,
      ref:"Product",
      required:true
  }
},{timestamps: true});
// user can leave only one comment for this particular product
ReviewSchema.index({product:1, user:1}, {unique: true})

ReviewSchema.statics.calculateAverageRating= async function( productId){
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating:{$avg: "$rating"},
        numOfReviews:{$sum: 1}
      },
    },
  ]);
  console.log(result);
 try {
   await this.model("Product").findOneAndUpdate(
     { _id: productId },
     {
       averageRaiting: Math.ceil(result[0]?.averageRating || 0),
       numOfReviews: result[0]?.numOfReviews || 0,
     }
   );
 } catch (error) {
   console.log(error)
 }
}

ReviewSchema.post("save", async function(){
  await this.constructor.calculateAverageRating(this.product);

});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);

});

module.exports = mongoose.model("Review", ReviewSchema);