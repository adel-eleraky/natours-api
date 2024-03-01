const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const displayValidationErrors = require("../utils/validationErrors");
const sendResponse = require("../utils/sendResponse");
const factory = require("./handlerFactory");


exports.getAllUsers = factory.getAll(User)
// exports.getAllUsers = asyncHandler(async (req, res, next) => {

//     const users = await User.find().select("-password")


//     // 3) send response to the client
//     sendResponse(res, 200, {
//         result: users.length,
//         data: { users }
//     })
// });

exports.setUserId = (req, res, next) => {
    req.params.id = req.user.id
    next()
}
exports.getUser = factory.getOne(User)
// exports.getUser = (req, res) => {
//     // 3) send response to the client
//     sendResponse(res, 200, {
//         data: "get single user"
//     })
// }

exports.createUser = asyncHandler(async (req, res) => {

    const userData = { ...req.body }

    const newUser = await User.create(userData)

    // 3) send response to the client
    sendResponse(res, 201, {
        status: "success",
        message: "this route is not yet defined, please use /signup instead",
    })
});


// delete user
exports.deleteUser = factory.deleteOne(User)
// exports.deleteUser = asyncHandler(async (req, res, next) => {

//     await User.findByIdAndDelete(req.user.id)

//     // 3) send response to the client
//     sendResponse(res, 204, {
//         status: "success",
//         message: "user deleted successfully",
//         data: null
//     })
// });

exports.setUpdateData = (req, res, next) => {

    const { email, name, role } = req.body
    req.updateData = { email, name, role }
    next()
}
exports.updateUser = factory.updateOne(User)  // don't update password with this handler
// exports.updateUser = asyncHandler(async (req, res, next) => {

// // 1)  check if there is errors from express-validator
// const errors = validationResult(req)
// if (!errors.isEmpty()) {
//     return displayValidationErrors(errors, res)
// }

//     //2) update user data
//     const { email, name, role } = req.body
//     const updateData = { email, name, role }
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
//         new: true,
//         runValidators: true
//     })

//     // send response to the client
//     sendResponse(res, 200, {
//         status: "success",
//         message: "user updated successfully",
//         updatedUser
//     })
// })



// update logged-in user
exports.updateMe = asyncHandler(async (req, res, next) => {

    // 1)  check if there is errors from express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return displayValidationErrors(errors, res)
    }

    const newUser = await User.findByIdAndUpdate(req.user.id, req.updateData, {
        new: true,
        runValidators: true
    })

    sendResponse(res, 200, {
        status: "success",
        message: "user updated successfully",
        user: newUser
    })
})