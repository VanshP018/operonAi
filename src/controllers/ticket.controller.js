import { classifyMessage } from "../services/classification.service.js";
import { processDecision } from "../services/decision.service.js";
import { refundPayment } from "../services/stripe.service.js";

export const handleTicket = async (req, res) => {
  const { userId, message } = req.body || {};
  const classification = classifyMessage(message);
  const decision = processDecision(userId, classification);
  let execution = { refundId: null };

  console.log("/ticket message:", message);
  console.log("/ticket classification:", classification);
  console.log("/ticket decision:", decision);

  if (decision?.action === "refund") {
    if (!decision.paymentId) {
      console.warn("/ticket refund skipped: missing paymentId");
    } else {
      try {
        const refund = await refundPayment(decision.paymentId);
        execution = { refundId: refund.id };
        console.log("/ticket refundId:", refund.id);
      } catch (error) {
        console.error("/ticket refund error:", error);
        return res.status(500).json({
          status: "error",
          message: "Refund failed",
        });
      }
    }
  }

  res.json({
    status: "ok",
    classification,
    decision,
    execution,
  });
};
