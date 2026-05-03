export const findDuplicatePayments = (payments) => {
  if (!Array.isArray(payments)) {
    return [];
  }

  const duplicates = [];

  for (let i = 0; i < payments.length; i += 1) {
    const current = payments[i];
    if (!current) {
      continue;
    }

    for (let j = i + 1; j < payments.length; j += 1) {
      const candidate = payments[j];
      if (!candidate) {
        continue;
      }

      const sameAmount = current.amount === candidate.amount;
      const sameDate = current.date === candidate.date;

      if (sameAmount && sameDate) {
        if (!duplicates.includes(current)) {
          duplicates.push(current);
        }
        if (!duplicates.includes(candidate)) {
          duplicates.push(candidate);
        }
      }
    }
  }

  return duplicates;
};
