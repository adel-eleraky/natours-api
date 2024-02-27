const Tour = require("./../models/tourModel")
const asyncHandler = require("./../utils/asyncHandler")


exports.getOverview = asyncHandler(async (req, res, next) => {

    // 1) get tours data from collection
    const tours = await Tour.find()

    // 2) build template
    res.status(200).render("overview", {
        title: "All tours",
        tours
    })
})

exports.getTour = asyncHandler(async (req, res, next) => {

    // 1) get the data for the requested tour
    const { slug } = req.params
    const tour = await Tour.findOne({ slug }).populate({
        path: "reviews",
        fields: "review rating user",
    })

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = asyncHandler(async (req , res , next) => {

    res.status(200).render("login", {
        title: "Log into your account"
    })
})