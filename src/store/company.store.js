const companies = {};

export const getCompanyById = (companyId) => {
  if (!companyId) {
    return null;
  }

  return companies[companyId] || null;
};

export const ensureCompany = (companyId, stripeCustomerId) => {
  if (!companyId) {
    return null;
  }

  if (!companies[companyId]) {
    companies[companyId] = {
      stripeCustomerId: stripeCustomerId || null,
      faqs: [],
    };
  } else if (stripeCustomerId) {
    companies[companyId].stripeCustomerId = stripeCustomerId;
  }

  return companies[companyId];
};

export const listFaqs = (companyId) => {
  const company = getCompanyById(companyId);
  return company ? company.faqs : [];
};

export const addFaq = (companyId, faq) => {
  const company = ensureCompany(companyId);
  if (!company) {
    return null;
  }

  company.faqs.push(faq);
  return faq;
};

export const updateFaq = (companyId, faqId, updates) => {
  const company = getCompanyById(companyId);
  if (!company) {
    return null;
  }

  const index = company.faqs.findIndex((faq) => faq.id === faqId);
  if (index === -1) {
    return null;
  }

  company.faqs[index] = {
    ...company.faqs[index],
    ...updates,
  };

  return company.faqs[index];
};

export const removeFaq = (companyId, faqId) => {
  const company = getCompanyById(companyId);
  if (!company) {
    return null;
  }

  const index = company.faqs.findIndex((faq) => faq.id === faqId);
  if (index === -1) {
    return null;
  }

  const [removed] = company.faqs.splice(index, 1);
  return removed;
};
