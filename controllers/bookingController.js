const asyncHandler = require("./../utils/asyncHandler");
const Tour = require("./../models/tourModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Booking = require("./../models/bookingModel");
const sendResponse = require("./../utils/sendResponse");
const factory = require("./handlerFactory");

exports.getCheckoutSession = asyncHandler(async (req, res, next) => {

    // 1) get the currently booked tour
    const { tourId } = req.params
    const tour = await Tour.findById(tourId)

    // 2) create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        // images: ['https://example.com/t-shirt.png'],
                    },
                },
                quantity: 1
            }
        ],
        mode: 'payment'
    })

    // 3) create session as response
    sendResponse(res, 200, {
        data: { session }
    })
})

exports.createBookingCheckout = asyncHandler(async (req, res, next) => {

    // this is only temp
    const { tour, user, price } = req.query

    if (!tour || !user || !price) return next()
    await Booking.create({ tour, user, price })

    res.redirect("/")
})

exports.getAllBookings = factory.getAll(Booking)