const path = require("path")
const express = require("express")
const setupGlobalMiddleware = require("./middlewares/globalMiddlewares")
const AppError = require('./utils/appError')
const globalErrorMiddleware = require("./middlewares/errorMiddleware")
const tourRouter = require("./routes/tourRouter")
const userRouter = require("./routes/userRouter")
const reviewRouter = require("./routes/reviewRouter")
const viewRouter = require("./routes/viewRouter")
const bookingRouter = require("./routes/bookingRouter")
const { webhookCheckout } = require("./controllers/bookingController")

const app = express()

// global middlewares
setupGlobalMiddleware(app)

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// Routes
app.use("/", viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/bookings", bookingRouter)

app.post("/webhook-checkout", express.raw({type:"application/json"}) ,webhookCheckout)

// unhandled Routes
app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404, 'fail'));
})

// global error handling middleware
app.use(globalErrorMiddleware)

module.exports = app