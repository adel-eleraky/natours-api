const express = require("express")
const viewsController = require("../controllers/viewsController")
const { protectRoute, isLoggedIn } = require("../middlewares/authMiddleware")

const router = express.Router()

// router.use(isLoggedIn)

router.get("/", isLoggedIn, viewsController.getOverview)
router.get("/tour/:slug", isLoggedIn, viewsController.getTour)
router.get("/login", isLoggedIn, viewsController.getLoginForm)
router.get("/me", protectRoute, viewsController.getAccount)
router.post("/submit-user-data" , protectRoute, viewsController.updateUserData)

module.exports = router