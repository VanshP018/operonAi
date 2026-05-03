import { classifyMessageAI } from "../services/aiClassification.service.js";
import { processDecision } from "../services/decision.service.js";
import { refundPayment } from "../services/stripe.service.js";
import { logEvent } from "../services/audit.service.js";
import { retrieveFAQ } from "../services/retrieval.service.js";

const processedRefunds = new Set();

export const handleTicket = async (req, res) => {
  const { userId, stripeCustomerId, message, mode } = req.body || {};
  const user = { userId, stripeCustomerId };
  const allowedCategories = ["billing_duplicate", "billing_other", "other"];
  logEvent({
    step: "input",
    companyId: req.companyId,
    userId,
    message,
  });

  let classification = await classifyMessageAI(message);

  if (!allowedCategories.includes(classification?.category)) {
    classification = { category: "other" };
  }
  let decision;
  let executionResult = null;
  let execution = { refundId: null };

  console.log("AI Classification:", classification);
  logEvent({
    step: "classification",
    result: classification,
  });

  const retrievalResult = await retrieveFAQ(
    message,
    classification,
    req.company?.faqs,
  );
  const suggestionAction = retrievalResult?.faq?.action || null;

  logEvent({
    step: "retrieval",
    companyId: req.companyId,
    message,
    matchedFaqId: retrievalResult?.faq?.id,
    score: retrievalResult?.score,
    suggestionAction,
  });

  console.log("/ticket retrieval:", retrievalResult);

  try {
    decision = await processDecision(user, classification);
  } catch (error) {
    console.error("/ticket decision error:", error);
    logEvent({
      step: "error",
      companyId: req.companyId,
      error: error.message,
    });
    return res.status(500).json({
      status: "error",
      message: "Decision failed",
    });
  }

  console.log("/ticket message:", message);
  console.log("/ticket classification:", classification);
  console.log("/ticket decision:", decision);

  logEvent({
    step: "decision",
    companyId: req.companyId,
    result: decision,
    suggestionAction,
  });

  if (decision?.action === "refund") {
    if (!decision.paymentId) {
      console.warn("/ticket refund skipped: missing paymentId");
      decision = { action: "escalate" };
    }

    if (decision?.action === "refund" && decision.amount > 1000) {
      console.warn("/ticket refund skipped: amount exceeds threshold");
      decision = { action: "escalate" };
    }

    if (decision?.action === "refund") {
      const paymentTime = new Date(`${decision.paymentDate}T00:00:00.000Z`).getTime();
      const tooOld =
        !Number.isFinite(paymentTime) ||
        paymentTime < Date.now() - 48 * 60 * 60 * 1000;

      if (tooOld) {
        console.warn("/ticket refund skipped: payment is too old");
        decision = { action: "escalate" };
      }
    }

    if (decision?.action === "refund") {
      if (mode === "dry_run") {
        console.log("/ticket dry run: refund skipped");
        execution = { refundId: null, dryRun: true };
      } else {
        const refundKey = `${userId}-${decision.paymentId}`;

        if (processedRefunds.has(refundKey)) {
          logEvent({
            step: "execution",
            companyId: req.companyId,
            action: decision.action,
            paymentId: decision.paymentId,
            refundId: executionResult?.id,
          });
          return res.json({
            status: "ok",
            message: "Refund already processed",
          });
        }

        try {
          const refund = await refundPayment(decision.paymentId);
          processedRefunds.add(refundKey);
          executionResult = refund;
          execution = { refundId: refund.id };
        } catch (error) {
          console.error("/ticket refund error:", error);
          logEvent({
            step: "error",
            companyId: req.companyId,
            error: error.message,
          });
          return res.status(500).json({
            status: "error",
            message: "Refund failed",
          });
        }
      }
    }
  }

  console.log("/ticket execution:", execution);

  logEvent({
    step: "execution",
    companyId: req.companyId,
    action: decision?.action,
    paymentId: decision?.paymentId,
    refundId: executionResult?.id,
    dryRun: mode === "dry_run",
  });

  res.json({
    status: "ok",
    classification,
    decision,
    execution,
  });
};
