const express = require('express');
const userController = require('./../controllers/userController');
const authController = require("./../controllers/authController")
const validation = require("./../middlewares/validationMiddleware")

const router = express.Router();

router.post(
    "/signup",
    validation.signupRules,
    authController.signup
)

router.post(
    "/login",
    validation.loginRules,
    authController.login
)

router.post(
    "/forget-password",
    validation.forgetPasswordRules,
    authController.forgetPassword
)

router.patch(
    "/reset-password/:PWD_token",
    validation.resetPasswordRules,
    authController.resetPassword
)



// crud operations on user
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router;
