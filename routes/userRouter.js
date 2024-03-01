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
// logout user
router.get(
    "/logout",
    authController.logout
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
    "/updateMe",
    protectRoute,
    validation.updateUserRules,
    userController.setUpdateData,
    userController.updateMe
)

// get current logged-in user data
router.get("/me", protectRoute, userController.setUserId, userController.getUser)
// crud operations on user
router
    .route('/')
    .get(userController.getAllUsers)
// .patch( protectRoute , validation.updateUserRules , userController.updateUser)

router
    .route("/:id")
    .get(userController.getUser)
    .delete(protectRoute, userController.deleteUser)
    .patch(protectRoute, validation.updateUserRules, userController.setUpdateData, userController.updateUser)


module.exports = router;
