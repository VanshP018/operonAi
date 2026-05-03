import { findDuplicatePayments } from "../utils/duplicateDetector.js";

export const processDecision = (userId, classification) => {
  const category = classification?.category;

  if (category !== "billing_duplicate") {
    return { action: "escalate" };
  }

  const payments = [
    { id: "pi_3TSto9B0QLsvw3Rp1iE6IwX0", amount: 20, date: "2026-05-01" },
    { id: "pi_3TStnvB0QLsvw3Rp0fze2UYP", amount: 20, date: "2026-05-01" },
  ];

  const duplicates = findDuplicatePayments(payments);

  if (duplicates.length === 0) {
    return { action: "none", escalate: true };
  }

  const secondDuplicate = duplicates[1] || duplicates[0];

  return {
    action: "refund",
    paymentId: secondDuplicate.id,
    amount: secondDuplicate.amount,
  };
};
