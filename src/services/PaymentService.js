import axios from 'axios';
import {BACKEND_API_URL} from '@env';

const PaymentService = {
    fetchPublishableKey: async () => {
        try {
            console.log('fetching public key' + `${BACKEND_API_URL}/config`);

            // const test = await axios.get(`${BACKEND_API_URL}/config`)
            // console.log(test)
            const response = await fetch(`${BACKEND_API_URL}/config`);
            // console.log(response)
            const {publishableKey} = await response.json();

            return publishableKey;
        } catch (e) {
            console.log(e);
            console.warn('Unable to fetch publishable key. Is your server running?');
            return null;
        }
    },
    fetchPaymentIntentClientSecret: async amount => {
        try {
            const response = await fetch(`${BACKEND_API_URL}/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodType: 'card',
                    currency: 'myr',
                    amount: amount,
                }),
            });
            const {clientSecret} = await response.json();

            return clientSecret;
        } catch (err) {
            return null;
            console.log(err);
        }
    },
};

export default PaymentService;
