const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const path = require("path");

const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomeError.NotFoundError(`no product with id ${productId}`);
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadyReviewed) {
    throw new CustomeError.BadRequestError(
      "this poduct already reviewed by user"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleeReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  if (!review) {
    throw new CustomeError.NotFoundError("No review with id of" + reviewId);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomeError.NotFoundError("No review with id of" + reviewId);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomeError.NotFoundError("No review with id of" + reviewId);
  }
  checkPermissions(req.user, review.user);
  await review.remove();

  res
    .status(StatusCodes.OK)
    .json({ msg: `Success! Review under id ${reviewId} has been deleted` });
};
const getSingleProductReviews =async(req, res)=>{
  const{id: productId} = req.params;
  const reviews = await Review.find({product: productId});
  res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}
module.exports = {
  createReview,
  getAllReviews,
  getSingleeReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
