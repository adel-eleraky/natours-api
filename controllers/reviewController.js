const Review = require("./../models/reviewModel")
const sendResponse = require("./../utils/sendResponse")
const asyncHandler = require("./../utils/asyncHandler")

// get all reviews handler
exports.getAllReviews = asyncHandler(async (req, res, next) => {

    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const Reviews = await Review.find(filter);

    sendResponse(res, 200, {
        result: Reviews.length,
        data: { Reviews }
    })
})

// create review handler
exports.createReview = asyncHandler(async (req, res, next) => {

    let { review, rating, tour, user } = req.body
    if (!tour) tour = req.params.tourId
    if (!user) user = req.user.id

    const updateData = { review, rating, tour, user }
    const newReview = await Review.create(updateData)

    sendResponse(res, 201, {
        status: "success",
        message: "review created successfully",
        data: {
            review: newReview
        }
    })
})