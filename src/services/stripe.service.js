import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.warn("STRIPE_SECRET_KEY is not set; Stripe refunds are disabled.");
}

const stripe = stripeKey ? new Stripe(stripeKey) : null;

export const refundPayment = async (paymentId) => {
  if (!stripe) {
    throw new Error("Stripe is not initialized. Check STRIPE_SECRET_KEY.");
  }

  if (!paymentId) {
    throw new Error("Missing paymentId for refund.");
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
    });

    return refund;
  } catch (error) {
    throw new Error(`Stripe refund failed: ${error?.message || "unknown error"}`);
  }
};
