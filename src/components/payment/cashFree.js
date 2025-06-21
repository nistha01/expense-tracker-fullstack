
import { createOrder } from '../api';

export const initiatePayment = async (orderData) => {
    try {
        const response = await createOrder(orderData);
        if (response.data && response.data.payment_session_id) {
            window.location.href = `https://sandbox.cashfree.com/pgapp/v1/session/${response.data.payment_session_id}`;
        }
    } catch (error) {
        console.error('Payment initiation failed:', error);
        alert('Payment initiation failed.');
    }
};
