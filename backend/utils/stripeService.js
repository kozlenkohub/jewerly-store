import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateTotalWithStripeFees = (amount) => {
  const FIXED_FEE = 0.3; // фиксированная комиссия ($0.30)
  const PERCENTAGE_FEE = 0.029; // процентная комиссия (2.9%)

  return Math.round((amount + FIXED_FEE) / (1 - PERCENTAGE_FEE));
};

const createPaymentIntent = async (amount, currency = 'uah') => {
  try {
    const amountWithFees = calculateTotalWithStripeFees(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      commision: amoutWithFees - amount,
      amount: amountWithFees * 100, // Stripe работает в центах
      currency,
      automatic_payment_methods: { enabled: true },
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
