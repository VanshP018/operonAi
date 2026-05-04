// src/middleware/auth.middleware.js
import { ensureCompany } from '../store/company.store.js';

const apiKeys = {
  "key_abc": "comp_123",
  // Add more API keys as needed
};

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer '
  console.log('API key:', apiKey);
  const companyId = apiKeys[apiKey];
  console.log('Company ID:', companyId);

  if (!companyId) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // Ensure company exists (for testing, use a dummy stripeCustomerId)
  ensureCompany(companyId, 'cus_test_123');

  req.companyId = companyId;
  next();
}

export { authenticate };