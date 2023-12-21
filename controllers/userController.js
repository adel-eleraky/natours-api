const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");

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

exports.updateUser = asyncHandler( async (req, res , next) => {

    const updatedUser = await User.findByIdAndUpdate( req.params.id , req.body , {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        message: "user updated successfully"
    })
})


exports.createUser = asyncHandler( async (req, res) => {

    const userData = { ...req.body }
    
    const newUser = await User.create(userData)
    
    res.status(201).json({
        status: "success",
        data: userData
    })
});

exports.deleteUser = asyncHandler( async (req, res ,next) => {

    const id = req.params.id

    await User.findByIdAndDelete(id)

    res.status(204).json({
        status: "success",
        message: "user deleted successfully",
        data: null
    })
});
