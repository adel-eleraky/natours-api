const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const displayValidationErrors = require("../utils/validationErrors");

exports.getAllUsers = asyncHandler( async (req, res, next) => {

    const users = await User.find().select("-password")

    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        } 
    });
});

exports.getUser = (req, res) => {
    res.json({ status: "success", data: "get single user" })
}

exports.createUser = asyncHandler( async (req, res) => {

    const userData = { ...req.body }
    
    const newUser = await User.create(userData)
    
    res.status(201).json({
        status: "success",
        data: userData
    })
});

exports.deleteUser = asyncHandler( async (req, res ,next) => {

    await User.findByIdAndDelete(req.user.id)

    res.status(204).json({
        status: "success",
        message: "user deleted successfully",
        data: null
    })
});


exports.updateUser = asyncHandler( async (req , res , next ) => {

    // 1)  check if there is errors from express-validator
    const errors = validationResult(req)
    if(! errors.isEmpty()){
        return displayValidationErrors(errors , res)
    }

    //2) update user data
    const updateData = { email: req.body.email , name: req.body.name }
    const updatedUser = await User.findByIdAndUpdate( req.user.id , updateData , {
        new: true,
        runValidators: true
    })

    // send response to the client
    res.status(200).json({
        status: "success",
        message: "user updated successfully",
        updatedUser
    })
})