import { useState } from "react";
import { API_BASE_URL } from "../config.js";

export function AddFAQ({ companyId, onFaqAdded, loading }) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("billing_duplicate");
  const [action, setAction] = useState("refund");
  const [limit, setLimit] = useState(1000);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!question.trim()) {
      setError("Question is required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          question,
          category,
          action,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add FAQ");
      }

      const data = await response.json();
      onFaqAdded(data.faq);

      setQuestion("");
      setCategory("billing_duplicate");
      setAction("refund");
      setLimit(1000);
    } catch (err) {
      setError(err.message || "Failed to add FAQ");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Question
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., I was charged twice"
          required
        />
      </label>

      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="billing_duplicate">Duplicate Billing</option>
          <option value="billing_other">Other Billing</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Action
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="refund">Refund</option>
          <option value="escalate">Escalate</option>
        </select>
      </label>

      <label>
        Limit (₹)
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min="0"
        />
      </label>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Adding..." : "Add Rule"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
