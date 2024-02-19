const express = require('express');
const tourController = require('./../controllers/tourController');
const { protectRoute , restrictTo } = require("./../middlewares/authMiddleware")
const reviewRouter = require("./reviewRouter")

const router = express.Router();

// param middleware
// router.param('id', tourController.checkId); 

router.use("/:tourId/reviews" , reviewRouter)

// get top five cheapest tours
router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours)

// get monthly plan per year 
router
    .route("/monthly-plan/:year")
    .get(tourController.getMonthlyPlan)

// get tour stats
router
    .route("/tours-stats")
    .get(tourController.getTourStats)

// CRUD operations on tours
router
    .route('/')
    .get( protectRoute , tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete( protectRoute , restrictTo("admin" , "lead-guide") , tourController.deleteTour);


module.exports = router;
