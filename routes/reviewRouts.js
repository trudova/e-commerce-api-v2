const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
    createReview,
    getAllReviews,
    getSingleeReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

router.route("/").post(authenticateUser, createReview).get(getAllReviews);

router.route("/:id").get(getSingleeReview).patch(authenticateUser, updateReview).delete([authenticateUser, authorizePermissions("admin","user")], deleteReview);

module.exports =router;