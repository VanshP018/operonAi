// src/controllers/webhook.controller.js
import crypto from 'crypto';
import { classifyMessageAI } from '../services/aiClassification.service.js';
import { retrieveFAQ } from '../services/retrieval.service.js';
import { processDecision } from '../services/decision.service.js';
import { refundPayment } from '../services/stripe.service.js';
import { logEvent } from '../services/audit.service.js';
import { getCompanyById, ensureCompany } from '../store/company.store.js';
import { setWebhookUrl, getWebhookUrl } from '../store/company.store.js';

// In-memory set for processed requests (in production, use Redis or database)
const processedRequests = new Set();

async function processWebhook(req, res) {
  console.log('Webhook controller called');
  try {
    const { userId, message, mode = 'dry_run', ticketId } = req.body;
    const companyId = req.companyId;

    console.log('Webhook request:', { companyId, userId, message, mode, ticketId });

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Invalid message" });
    }

    // Idempotency key
    const idempotencyKey = ticketId ? `${companyId}-${ticketId}` : `${companyId}-${crypto.createHash('sha256').update(message).digest('hex')}`;

    if (processedRequests.has(idempotencyKey)) {
      return res.json({
        status: "duplicate_ignored",
        response: "This message has already been processed.",
        mode
      });
    }

    processedRequests.add(idempotencyKey);

    // Get company data
    const companyData = ensureCompany(companyId);
    if (!companyData) {
      return res.status(400).json({ error: "Company not found" });
    }

    // Log incoming request
    await logEvent(companyId, 'webhook_received', {
      userId,
      message,
      mode,
      ticketId
    });

    // Classify message
    const classification = await classifyMessageAI(message);
    await logEvent(companyId, 'classification_completed', {
      userId,
      classification
    });

    // Retrieve FAQ
    const faqMatch = await retrieveFAQ(message, companyData.faqs);
    await logEvent(companyId, 'faq_retrieved', {
      userId,
      faqMatch
    });

    // Process decision
    const user = { userId, stripeCustomerId: companyData.stripeCustomerId };
    const decision = await processDecision(user, classification, mode);
    await logEvent(companyId, 'decision_made', {
      userId,
      decision
    });

    let execution = { refundId: null };
    let responseMessage = "Your request has been processed.";

    // Execute action if live mode
    if (mode === 'live' && decision.action === 'refund') {
      try {
        const refundResult = await refundPayment(decision.paymentId, decision.amount);
        execution.refundId = refundResult.id;
        responseMessage = `Refund of $${decision.amount} has been processed.`;
        await logEvent(companyId, 'refund_executed', {
          userId,
          refundId: execution.refundId,
          amount: decision.amount
        });
      } catch (error) {
        console.error('Refund failed:', error);
        await logEvent(companyId, 'refund_failed', {
          userId,
          error: error.message
        });
        responseMessage = "Refund processing failed. Please contact support.";
      }
    } else if (mode === 'dry_run') {
      responseMessage = `Dry run: Would process ${decision.action} for $${decision.amount}.`;
    }

    // Determine status
    const status = decision.action === 'escalate' ? 'escalated' : 'resolved';

    const result = {
      status,
      response: responseMessage,
      classification,
      decision,
      execution,
      mode
    };

    // Optional: Send callback to company's webhook URL
    if (companyData.webhookUrl && mode === 'live') {
      try {
        await fetch(companyData.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
      } catch (error) {
        console.error('Callback failed:', error);
      }
    }

    res.json(result);

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function registerWebhook(req, res) {
  try {
    const { webhookUrl } = req.body;
    const companyId = req.companyId;

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return res.status(400).json({ error: "Invalid webhook URL" });
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const company = setWebhookUrl(companyId, webhookUrl);
    if (!company) {
      return res.status(400).json({ error: "Company not found" });
    }

    res.json({ message: "Webhook URL registered successfully" });

  } catch (error) {
    console.error('Webhook registration error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { processWebhook, registerWebhook };