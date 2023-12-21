const User = require("../models/userModel");
const { signToken } = require("../utils/jsonWebToken")
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator")
const AppError = require("./../utils/appError")


// signup user handler
exports.signup = asyncHandler(async (req, res, next) => {

    // check if there is validation errors coming from express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // signup new user
    const { name, email, password, passwordConfirm , passwordChangedAt} = req.body

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        passwordChangedAt
    })

    // generate token
    const token = signToken({ id: newUser._id })

    res.status(201).json({
        status: "success",
        token,
        message: "new user created successfully",
        data: {
            user: newUser
        }
    })
})

// login user handler
exports.login = asyncHandler(async (req, res, next) => {

    // check if there is validation errors coming from express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // find user by email
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // check password is correct
    const result = await user.checkPassword(password , user.password)
    if(! result) return next(new AppError("Incorrect email or password" , 400 , "fail"))

    // generate token
    const token = signToken({ id: user._id })

    res.status(200).json({
        status: "success",
        token,
    })
})