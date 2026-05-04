import { useState } from "react";
import { API_BASE_URL } from "../config.js";

export function WebhookRegistration({ companyId, apiKey }) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegisterWebhook = async (e) => {
    e.preventDefault();
    
    if (!webhookUrl.trim()) {
      setError("Please enter a webhook URL");
      return;
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch {
      setError("Invalid URL format");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/webhook/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ webhookUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to register webhook");
      }

      setIsRegistered(true);
      setSuccess("Webhook registered successfully!");
      setWebhookUrl("");
    } catch (err) {
      setError(err.message || "Failed to register webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>4. Webhook Callbacks</h2>
        <span className="status-badge">
          {isRegistered ? "✅ Registered" : "⚪ Not Registered"}
        </span>
      </div>

      <p className="section-desc">
        Register a webhook URL to receive callbacks when decisions are made. 
        Your endpoint will receive POST requests with the processing results.
      </p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleRegisterWebhook} className="webhook-form">
        <div className="form-group">
          <label htmlFor="webhook-url">Webhook URL</label>
          <input
            id="webhook-url"
            type="url"
            placeholder="https://your-api.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Webhook"}
        </button>
      </form>

      {isRegistered && (
        <div className="webhook-info">
          <h3>Webhook Setup Complete</h3>
          <p>Your webhook will receive POST requests with this structure:</p>
          <pre className="webhook-example">
{`{
  "status": "resolved",
  "response": "Refund of $29.99 has been processed.",
  "classification": {
    "category": "billing_duplicate"
  },
  "decision": {
    "action": "refund",
    "paymentId": "pi_123",
    "amount": 29.99,
    "paymentDate": "2026-05-03"
  },
  "execution": {
    "refundId": "re_123"
  },
  "mode": "live"
}`}
          </pre>
        </div>
      )}
    </section>
  );
}
