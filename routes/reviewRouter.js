const express = require("express")
const reviewController = require("./../controllers/reviewController")
const { protectRoute , restrictTo } = require("./../middlewares/authMiddleware")

const router = express.Router({ mergeParams: true })

router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(
        protectRoute,
        restrictTo("user"),
        reviewController.setTourUserIds,
        reviewController.createReview
    )

router
    .route("/:id")
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)

module.exports = router