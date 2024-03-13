const stripe = Stripe("pk_test_51MQiTdHdpPhRIKKWKS8bzAP7QcJHnbcqNmCzH9SK64ifDGAZFzIGTZIxEOmIoXIOs5MiUrhlFZqtpA6YGK2PqNrL00HGYrQEpd")
import axios from "axios"

export const bookTour = async tourId => {

    // 1) get checkout session from API
    const session = await axios({
        method: "GET",
        url: `/api/v1/bookings/checkout-session/${tourId}`
    })

    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.data.session.id
    })

}