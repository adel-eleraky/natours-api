const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const displayValidationErrors = require("../utils/validationErrors");
const sendResponse = require("../utils/sendResponse");

exports.getAllUsers = asyncHandler(async (req, res, next) => {

    const users = await User.find().select("-password")


    // 3) send response to the client
    sendResponse(res, 200, {
        result: users.length,
        data: { users }
    })
});

exports.getUser = (req, res) => {
    // 3) send response to the client
    sendResponse(res, 200, {
        data: "get single user"
    })
}

exports.createUser = asyncHandler(async (req, res) => {

    const userData = { ...req.body }

    const newUser = await User.create(userData)

    // 3) send response to the client
    sendResponse(res, 201, {
        status: "success",
        data: {
            newUser
        }
    })
});

exports.deleteUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.user.id)

    // 3) send response to the client
    sendResponse(res, 204, {
        status: "success",
        message: "user deleted successfully",
        data: null
    })
});


exports.updateUser = asyncHandler(async (req, res, next) => {

    // 1)  check if there is errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }

    //2) update user data
    const { email, name, role , test } = req.body
    const updateData = { email, name, role ,test}
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true
    })

    // send response to the client
    sendResponse(res, 200, {
        status: "success",
        message: "user updated successfully",
        updatedUser
    })
})