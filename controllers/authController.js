const crypto = require("crypto")
const User = require("../models/userModel");
const { signToken } = require("../utils/jsonWebToken")
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("./../utils/appError")
const sendEmail = require("./../utils/email")
const { validationResult } = require("express-validator")
const displayValidationErrors = require("./../utils/validationErrors");
const sendResponse = require("../utils/sendResponse");

// signup user handler
exports.signup = asyncHandler(async (req, res, next) => {

    // 1) check if there is validation errors coming from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }

    // 2) signup new user
    const { name, email, password, passwordConfirm, role } = req.body

    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        role,
    })

    // 3) generate token
    const token = signToken({ id: newUser._id })

    // 4) send response to the client
    sendResponse(res, 201, {
        message: "new user created successfully",
        token
    })
})

// login user handler
exports.login = asyncHandler(async (req, res, next) => {

    // 1) check if there is validation errors coming from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }

    // 2) find user by email
    const { email, password } = req.body
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new AppError("Incorrect email or password", 401, "fail"))

    // 3) check password is correct
    const result = await user.checkPassword(password, user.password)
    if (!result) return next(new AppError("Incorrect email or password", 401, "fail"))

    // 4) generate token
    const token = signToken({ id: user._id })

    // 5) send response to the client
    sendResponse(res, 200, {
        message: "logged in successfully",
        token
    })
})


// forget password handler
exports.forgetPassword = asyncHandler(async (req, res, next) => {

    // 1) check if there is errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }

    // 2) find user by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError("Enter valid email", 401, "fail"))

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
    sendResponse(res, 200, {
        message: "Password Reset Token sent to your email"
    })
})

// reset password handler
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // 1) check if there is errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }
    // 2) find user by PWD reset token
    const hashedToken = crypto.createHash("sha256").update(req.params.PWD_token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpire: { $gt: Date.now() }
    })

    // 3) check if the token has not expired , and there is user, set the new password
    if (!user) return next(new AppError("Invalid token or has expired", 401, "fail"))

    const { password, passwordConfirm } = req.body

    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetTokenExpire = undefined
    await user.save()

    // 4) log the user in , send JWT to the client
    const token = signToken({ id: user._id })

    // 5) send response to the client
    sendResponse(res, 200, {
        message: "password reset successfully",
        token
    })
})


// update current user password
exports.updatePassword = asyncHandler(async (req, res, next) => {

    // 1) check if there is errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }
    // 2) get current user
    const user = req.user

    //3) update user password
    const { oldPassword, newPassword, newPasswordConfirm } = req.body
    // check password is correct
    const result = await user.checkPassword(oldPassword, user.password)
    if (!result) return next(new AppError("Incorrect password", 401, "fail"))

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save()

    // 4) log user in, send JWT to the client
    const token = signToken({ id: user._id })

    // 5) send response to the client
    sendResponse(res, 200, {
        message: "password updated successfully",
        token
    })
})