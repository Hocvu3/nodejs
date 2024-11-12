import axios from 'axios';
const stripe = Stripe('pk_test_51QJyYtHSHIJYlCtB7YuaZscaOwWm8I7lZdquEd1masON56VROFRYb5lck7V0r3OneudyOJZPnGKB5SrdT9WqzGdt00Fonfc5Gd');

export const bookTour = async (tourId) => {
    console.log(tourId);
    try {
        // 1) Get checkout session from API
        const response = await axios.get(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        const session = response.data.session; // Assign session data properly
        console.log(session);  // You can check the session data here
        
        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.id // Use session id from API response
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
}
