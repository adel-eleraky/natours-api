const express = require("express")
const viewsController = require("../controllers/viewsController")
const { protectRoute } = require("../middlewares/authMiddleware")

const router = express.Router()


router.get("/" , viewsController.getOverview)
router.get("/tour/:slug" , protectRoute ,viewsController.getTour)
router.get("/login" , viewsController.getLoginForm)

module.exports = router