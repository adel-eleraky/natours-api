const express = require('express')
const { protectRoute } = require('../middlewares/authMiddleware')
const bookingController = require("./../controllers/bookingController")

const router = express.Router()

router.get(
    "/checkout-session/:tourId",
    protectRoute,
    bookingController.getCheckoutSession
    )

module.exports = router