const express = require('express');
const userController = require('./../controllers/userController');
const authController = require("./../controllers/authController")
const validation = require("./../middlewares/validationMiddleware");
const { protectRoute } = require('../middlewares/authMiddleware');

const router = express.Router();

// sign-up new user
router.post(
    "/signup",
    validation.signupRules,
    authController.signup
)
// login user
router.post(
    "/login",
    validation.loginRules,
    authController.login
)
// forget password functionality
router.post(
    "/forget-password",
    validation.forgetPasswordRules,
    authController.forgetPassword
)
// reset user password
router.patch(
    "/reset-password/:PWD_token",
    validation.resetPasswordRules,
    authController.resetPassword
)
// update user password
router.patch(
    "/update-password",
    protectRoute,
    validation.updatePasswordRules,
    authController.updatePassword
)

// update user data
router.patch(
    "/update-user",
    protectRoute,
    validation.updateUserRules,
    userController.updateUser
)

// crud operations on user
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .delete(userController.deleteUser)


module.exports = router;
