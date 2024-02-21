const mongoose = require("mongoose");
const Tour = require("./tourModel")

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

// update tour [ ratingsQuantity , ratingsAverage ] when creating review on that tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {

    const stats = await this.aggregate([ // this keyword refer to the model
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour",
                nRatings: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ])

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRatings,
        ratingsAverage: stats[0].avgRating
    })
}

reviewSchema.post("save", function () {
    this.constructor.calcAverageRatings(this.tour)  // this keyword refer to the document
})

const ReviewModel = mongoose.model("Review", reviewSchema)
module.exports = ReviewModel