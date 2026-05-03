import Stripe from "stripe";

let stripeClient = null;

export const getStripeClient = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    console.warn("STRIPE_SECRET_KEY is not set; Stripe is disabled.");
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeKey);
  }

  return stripeClient;
};
