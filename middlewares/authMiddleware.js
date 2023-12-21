const User = require("../models/userModel");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken")

exports.protectRoute = asyncHandler(async (req , res , next) => {

    let token;

    // 1) getting token from header
    if(! req.headers.authorization || ! req.headers.authorization.startsWith("Bearer")) {
        return next(new AppError("You are not logged in , please log-in to get access" , 401 , "fail"))
    }
    token = req.headers.authorization.split(" ")[1];

    // 2) verify token
    const decodedJWT = jwt.verify(token , process.env.JWT_SECRET)


    // 3) check if the user belonging to this token still exist
    const user = await User.findById(decodedJWT.id)
    if(! user) return next(new AppError("the User belonging to this token doesn't exist" , 401 , "fail"))


    // 4) check if user change password after token was issued
    if(user.changedPasswordAfter(decodedJWT.iat)) {
        return next(new AppError("user recently changed password! please log in again." , 401 , "fail"))
    }


    // GRANT access to protected route
    req.user = user
    next()
})