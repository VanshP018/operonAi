import { findDuplicatePayments } from "../utils/duplicateDetector.js";
import { getCustomerPayments } from "./stripe.service.js";

export const processDecision = async (user, classification, mode = 'live') => {
  const category = classification?.category;

  if (category !== "billing_duplicate") {
    return { action: "escalate" };
  }

  if (mode === 'dry_run') {
    // Mock decision for dry run
    return {
      action: "refund",
      paymentId: "pi_mock_123",
      amount: 29.99,
      paymentDate: new Date().toISOString().split('T')[0],
    };
  }

  const customerId = user?.stripeCustomerId;
  const payments = await getCustomerPayments(customerId);
  const cutoffTime = Date.now() - 48 * 60 * 60 * 1000;

  const recentSucceededPayments = payments.filter((payment) => {
    if (payment.status !== "succeeded") {
      return false;
    }

    const paymentTime = new Date(`${payment.date}T00:00:00.000Z`).getTime();
    return Number.isFinite(paymentTime) && paymentTime >= cutoffTime;
  });

  const duplicates = findDuplicatePayments(recentSucceededPayments);

  if (duplicates.length === 0) {
    return { action: "none", escalate: true };
  }

  const secondDuplicate = duplicates[1] || duplicates[0];

  return {
    action: "refund",
    paymentId: secondDuplicate.id,
    amount: secondDuplicate.amount,
    paymentDate: secondDuplicate.date,
  };
};
