const express = require('express');
const tourController = require('./../controllers/tourController');
const { protectRoute, restrictTo } = require("./../middlewares/authMiddleware")
const reviewRouter = require("./reviewRouter")

const router = express.Router();

// param middleware
// router.param('id', tourController.checkId); 

router.use("/:tourId/reviews", reviewRouter)

// get top five cheapest tours
router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours)

// get monthly plan per year 
router
    .route("/monthly-plan/:year")
    .get(protectRoute, restrictTo("admin", "lead-guide", "guide"), tourController.getMonthlyPlan)

// get tour stats
router
    .route("/tours-stats")
    .get(tourController.getTourStats)

// geo-spatial queries: tours within certain distance of certain coordinates
router.route("/tours-within/:distance/center/:lat_lng/unit/:unit").get(tourController.getToursWithin)

// get distance of tours between two coordinates
router.route("/tours-distance/:lat_lng/unit/:unit").get(tourController.getToursDistance)

// CRUD operations on tours
router
    .route('/')
    .get(tourController.getAllTours)
    .post(protectRoute, restrictTo("admin", "lead-guide"), tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(protectRoute, restrictTo("admin", "lead-guide"), tourController.updateTour)
    .delete(protectRoute, restrictTo("admin", "lead-guide"), tourController.deleteTour);


module.exports = router;
