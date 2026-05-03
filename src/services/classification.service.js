export const classifyMessage = (message) => {
  if (typeof message !== "string") {
    return { category: "other" };
  }

  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("charged twice") ||
    normalizedMessage.includes("double charge") ||
    normalizedMessage.includes("charged 2 times")
  ) {
    return { category: "billing_duplicate" };
  }

  if (
    normalizedMessage.includes("refund") ||
    normalizedMessage.includes("payment issue")
  ) {
    return { category: "billing_other" };
  }

  return { category: "other" };
};
