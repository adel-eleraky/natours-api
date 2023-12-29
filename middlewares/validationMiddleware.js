const { check } = require("express-validator")
const User = require("./../models/userModel")
const bcrypt = require("bcryptjs")

// validation rules for signup new user
exports.signupRules = [
    check("name")
        .notEmpty().withMessage("please enter your name")
        .isString().withMessage("name must be string")
        .isLength({ min: 2, max: 32 }).withMessage("name must be between 2 and 32 character"),

    check("email")
        .notEmpty().withMessage("please enter your email")
        .isEmail().withMessage("Invalid Email")
        .custom(async (val) => { // check if email is unique

            const existingUser = await User.findOne({ email: val })
            if (existingUser) {
                throw new Error("email is already in use")
            }

            return true;
        }),

    check("password")
        .notEmpty().withMessage("please enter your password")
        .isLength({ min: 8 }).withMessage("password must be more than 8 character")
        .isStrongPassword().withMessage("enter strong password"),

    check("passwordConfirm")
        .notEmpty().withMessage("please enter password confirm")
        .custom((val, { req }) => {
            if (val !== req.body.password) throw new Error("password doesn't match")

            return true;
        })
]


// validation rules for user login
exports.loginRules = [
    check("email")
        .notEmpty().withMessage("please enter your email")
        .isEmail().withMessage("Invalid Email")
        .custom(async (val, { req }) => {  // check if email exist in database
            const existingUser = await User.findOne({ email: val })

            if (!existingUser) {
                throw new Error("Incorrect email or password")
            }

            req.user = existingUser;
            return true;
        }),

    check("password")
        .notEmpty().withMessage("please enter your password")
        .custom(async (val, { req }) => { // check if the password is correct

            if (req.user) {
                const passwordMatch = await bcrypt.compare(val, req.user.password)

                if (!passwordMatch) {
                    throw new Error("Incorrect email or password")
                }

                return true;
            }
        })
]

// validation rules for forget password
exports.forgetPasswordRules = [
    check("email")
        .notEmpty().withMessage("enter your email")
        .isEmail().withMessage("Invalid Email")
        .custom(async (val, { req }) => {
            const user = await User.findOne({ email: val })

            if (!user) throw new Error("Invalid Email")

            return true;
        })
]

// validation rules for reset password
exports.resetPasswordRules = [
    check("password")
        .notEmpty().withMessage("please enter new password")
        .isLength({ min: 8 }).withMessage("password must be more than 8 character")
        .isStrongPassword().withMessage("please enter strong password"),

    check("passwordConfirm")
        .notEmpty().withMessage("please enter password confirm")
        .custom((val, { req }) => {
            if (val !== req.body.password) throw new Error("password doesn't match")

            return true;
        }),

]

// validation rules for update current user password
exports.updatePasswordRules = [
    check("oldPassword")
        .notEmpty().withMessage("please enter old password")
        .custom(async (val, { req }) => { // check if the password is correct

            if (req.user) {
                const passwordMatch = await bcrypt.compare(val, req.user.password)

                if (!passwordMatch) throw new Error("Incorrect password")

                return true
            }
        }),

    check("newPassword")
        .notEmpty().withMessage("please enter new password")
        .isLength({ min: 8 }).withMessage("password must be more than 8 character")
        .isStrongPassword().withMessage("please enter strong password"),

    check("newPasswordConfirm")
        .notEmpty().withMessage("please enter password confirm")
        .custom((val, { req }) => {

            if (val !== req.body.newPassword) throw new Error("password doesn't match")

            return true;
        })
]