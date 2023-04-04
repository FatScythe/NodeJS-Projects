const Review = require("../models/Review");
const Product = require("../models/Product");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermisson } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;

  const isProductValid = await Product.findOne({ _id: productId });
  if (!isProductValid) {
    throw new NotFoundError(`No product with ID: ${productId}`);
  }

  const isAlreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (isAlreadySubmitted) {
    throw new BadRequestError(
      "User already submitted a review for this product"
    );
  }
  req.body.user = userId;
  const reviews = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ nbHits: reviews.length, reviews });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ nbHits: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });
  if (!review) {
    throw new NotFoundError(`Cannot find Review with id: ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`Review with id: ${reviewId} cannot be found`);
  }

  checkPermisson(req.user, review.user);
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
    throw new NotFoundError(`Review with id: ${reviewId} cannot be found`);
  }
  checkPermisson(req.user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Deleted Sucessfully" });
};

// Since using virtuals in the product model doesnot allow us to query the DB, the alternative means is this
const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ nbHits: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
