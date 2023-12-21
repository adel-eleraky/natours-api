const express = require("express")
const morgan = require("morgan")
const AppError = require('./utils/appError')
const globalErrorMiddleware = require("./middlewares/errorMiddleware")
const tourRouter = require("./routes/tourRouter")
const userRouter = require("./routes/userRouter")

const app = express()

// middlewares
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))


// Routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

// unhandled Routes
app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404, 'fail'));
})

// global error handling middleware
app.use(globalErrorMiddleware)

module.exports = app