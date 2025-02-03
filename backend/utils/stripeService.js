import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateAmountWithCommission = (amount) => {
  // Stripe fee is 2.9% + 0.30 USD
  // Formula: (amount + 0.30) / (1 - 0.029)
  return Math.round((amount + 0.3) / (1 - 0.029));
};

const createPaymentIntent = async (amount, currency = 'uah') => {
  try {
    const amountWithCommission = calculateAmountWithCommission(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountWithCommission * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Error creating payment intent: ${error.message}`);
  }
};

const confirmPaymentIntent = async (paymentIntentId, paymentMethod) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Error confirming payment intent: ${error.message}`);
  }
};

export { createPaymentIntent, confirmPaymentIntent };
