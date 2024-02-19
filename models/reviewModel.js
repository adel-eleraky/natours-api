const mongoose = require("mongoose");

reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "review can not be empty"]
    },
    rating: {
        type: Number,
        min: [1, 'rating must be above 1.0'],
        max: [5, 'rating must be below 5.0']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "review must belong to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "review must belong to a user"]
    },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

reviewSchema.pre(/^find/, function (next) {

    this.populate({
        path: "user",
        select: "name photo"
    })
    next()
})

const ReviewModel = mongoose.model("Review", reviewSchema)
module.exports = ReviewModel