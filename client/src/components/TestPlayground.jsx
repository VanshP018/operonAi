import { useState } from "react";
import { API_BASE_URL } from "../config.js";

export function TestPlayground({ companyId }) {
  const [testMessage, setTestMessage] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async () => {
    setError("");
    setTestResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          userId: "test_user",
          message: testMessage,
          mode: "dry_run",
        }),
      });

      if (!response.ok) {
        throw new Error("Test failed");
      }

      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setError(err.message || "Test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2>3. Test Playground</h2>
      <p className="section-desc">
        Test your rules in dry-run mode (no real execution).
      </p>

      <div className="playground">
        <div className="test-input">
          <label>
            Test Message
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="e.g., I got billed twice for the same order"
              rows={3}
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={handleTest}
            disabled={!testMessage.trim() || loading}
          >
            {loading ? "Running Test..." : "Run Test"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {testResult && (
          <div className="test-result">
            <h3>Test Result</h3>
            <div className="result-item">
              <strong>Classification:</strong>
              <span className="tag">
                {testResult.classification?.category || "N/A"}
              </span>
            </div>

            {testResult.decision && (
              <>
                <div className="result-item">
                  <strong>Decision:</strong>
                  <span className="tag decision">
                    {testResult.decision.action}
                  </span>
                </div>
                {testResult.decision.amount && (
                  <div className="result-item">
                    <strong>Amount:</strong>
                    <span>₹{testResult.decision.amount / 100}</span>
                  </div>
                )}
              </>
            )}

            <div className="result-item">
              <strong>Dry Run:</strong>
              <span className="tag info">
                {testResult.execution?.dryRun ? "Yes" : "No"}
              </span>
            </div>

            <p className="success-text">
              ✅ Test successful. System behavior preview shown above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
