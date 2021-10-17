const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
      maxlength: [100, "Name can not be longer then 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "please provide description"],
      trim: true,
      maxlength: [1000, "Description  can not be longer then 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "please provide category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "please provide company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      default: ["black"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeSipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 15,
    },
    averageRaiting: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField:"_id",
  foreignField: "product",
  justOne:false,

});
ProductSchema.pre("remove", async function(next){
  await this.model("Review").deleteMany({product: this._id});
})

module.exports = mongoose.model("Product", ProductSchema);