const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const path = require("path");

const {
  createTokenUser,
  attachCookiesTorespons,
  checkPermissions,
} = require("../utils");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.lengh });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("reviews");
  if (!product) {
    throw CustomeError.NotFoundError(
      `Product this id ${productId} does not exists`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw CustomeError.NotFoundError(
      `Product this id ${productId} does not exists`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw CustomeError.NotFoundError(
      `Product this id ${productId} does not exists`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! product removed" });
};

const uploadImage = async (req, res) => {
  if( !req.files){
      throw new CustomeError.BadRequestError("Please provide the image");
  }
  const productImage =req.files.image;
  if(!productImage.mimetype.startsWith("image")){
      throw new CustomeError.BadRequestError("Only Images are supported");

  }
  const maxSize = 1024 * 1024;
  if( productImage.size > maxSize){
      throw new CustomeError.BadRequestError("Please provide the image smaller than 1MB");
  }
const imagePath = path.join(__dirname, "../public/uploads/"+ `${productImage.name}`);

await productImage.mv(imagePath);
res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`});
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
