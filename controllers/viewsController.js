const Tour = require("./../models/tourModel")
const User = require("./../models/userModel")
const asyncHandler = require("./../utils/asyncHandler")
const AppError = require("./../utils/appError")

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

    if (!tour) return next(new AppError("There is no tour with that name", 404, "fail"))

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = asyncHandler(async (req, res, next) => {

    res.status(200).render("login", {
        title: "Log into your account"
    })
})

exports.getAccount = asyncHandler(async (req, res, next) => {

    res.status(200).render("account", {
        title: "Your account"
    })
})

exports.updateUserData = asyncHandler(async (req, res, next) => {

    const updateData = {
        name: req.body.name,
        email: req.body.email
    }
    const newUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true
    })

    res.status(200).redirect("/me")
})
