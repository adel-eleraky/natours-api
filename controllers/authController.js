const crypto = require("crypto")
const User = require("../models/userModel");
const { signToken } = require("../utils/jsonWebToken")
const asyncHandler = require("../utils/asyncHandler");
const { validationResult } = require("express-validator")
const AppError = require("./../utils/appError")
const sendEmail = require("./../utils/email")

// signup user handler
exports.signup = asyncHandler(async (req, res, next) => {

    // 1) check if there is validation errors coming from express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // 2) signup new user
    const { name, email, password, passwordConfirm , role , passwordChangedAt} = req.body

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        role,
        passwordChangedAt
    })

    // 3) generate token
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

    // 1) check if there is validation errors coming from express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // 2) find user by email
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(! user) return next(new AppError("Incorrect email or password" , 404 , "fail"))

    // 3) check password is correct
    const result = await user.checkPassword(password , user.password)
    if(! result) return next(new AppError("Incorrect email or password" , 400 , "fail"))

    // 4) generate token
    const token = signToken({ id: user._id })

    res.status(200).json({
        status: "success",
        token,
    })
})


// forget password handler
exports.forgetPassword = asyncHandler( async (req , res , next) => {

    // 1) check if there is errors from express-validator
    const errors = validationResult(req)
    if(! errors.isEmpty()) {
        return res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // 2) find user by email
    const user = await User.findOne({ email: req.body.email })
    if(! user) return next(new AppError("Enter valid email" , 404 , "fail"))

    // 3) generate && save password reset token in database
    const resetToken = user.createPwdToken()
    await user.save({ validateBeforeSave: false })

    // 4) send PWD reset token to user's email
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`

    const message = `Forgot your password? click the link below \n ${resetUrl} \n if you didn't forgot your password, please ignore this email`

    await sendEmail({
        email: user.email,
        subject: "Password Reset Token ( valid for 10 minutes)",
        message
    })

    // 5) send response to the client
    res.status(200).json({
        status: "success",
        message: "Password Reset Token sent to your email"
    })
})

// reset password handler
exports.resetPassword = asyncHandler( async (req , res , next) => {

    // 1) check if there is errors from express-validator
    const errors = validationResult(req)
    if(! errors.isEmpty()) {

        res.status(400).json({
            status: "fail",
            message: "validation errors",
            errors: errors.array({ onlyFirstError: true })
        })
    }

    // 2) find user by PWD reset token
    const hashedToken = crypto.createHash("sha256").update(req.params.PWD_token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpire: { $gt: Date.now() }
    })

    // 3) check if the token has not expired , and there is user, set the new password
    if(! user) return next(new AppError("Invalid token or has expired" , 400 , "fail"))

    const { password , passwordConfirm } = req.body
    
    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTokenExpire = undefined
    await user.save()

    // 4) log the user in , send JWT to the client
    const token = signToken({ id: user._id })

    res.status(200).json({
        status: "success",
        message: "password reset successfully",
        token
    })
})