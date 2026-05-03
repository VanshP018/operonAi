import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000";

const formatJson = (value) => JSON.stringify(value, null, 2);
const formatCurrency = (value, currency = "USD") => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value / 100);
};

function App() {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("user_demo");
  const [stripeCustomerId, setStripeCustomerId] = useState("");
  const [ticketResponse, setTicketResponse] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");
  const [logsError, setLogsError] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const loadLogs = async () => {
    setLogsLoading(true);
    setLogsError("");

    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      const nextLogs = Array.isArray(data) ? data : data.logs;
      setLogs(Array.isArray(nextLogs) ? nextLogs : []);
    } catch (fetchError) {
      setLogsError(fetchError.message || "Failed to load logs");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          stripeCustomerId: stripeCustomerId || undefined,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Ticket request failed");
      }

      const data = await response.json();
      setTicketResponse(data);
      setLastMessage(message);
      await loadLogs();
    } catch (submitError) {
      setError(submitError.message || "Ticket request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Autonomous Support Dashboard</p>
          <h1>Ticket Simulation</h1>
        </div>
        <button className="ghost" type="button" onClick={loadLogs}>
          Refresh logs
        </button>
      </header>

      <main className="grid">
        <section className="panel">
          <h2>1) Ticket Input</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              User ID
              <input
                type="text"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="user_123"
              />
            </label>
            <label>
              Stripe Customer ID (optional)
              <input
                type="text"
                value={stripeCustomerId}
                onChange={(event) => setStripeCustomerId(event.target.value)}
                placeholder="cus_123"
              />
            </label>
            <label>
              Message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="I was charged twice for the same service."
                rows={5}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        </section>

        <section className="panel">
          <h2>2) Result Display</h2>
          {ticketResponse ? (
            <div className="results">
              <div>
                <h3>Message</h3>
                <p>{lastMessage}</p>
              </div>
              <div>
                <h3>Classification</h3>
                <pre>{formatJson(ticketResponse.classification)}</pre>
              </div>
              <div>
                <h3>Decision</h3>
                {ticketResponse.decision?.amount ? (
                  <p className="amount">
                    {formatCurrency(ticketResponse.decision.amount)}
                  </p>
                ) : null}
                <pre>{formatJson(ticketResponse.decision)}</pre>
              </div>
              <div>
                <h3>Execution</h3>
                <pre>{formatJson(ticketResponse.execution)}</pre>
              </div>
            </div>
          ) : (
            <p className="muted">Submit a ticket to see the result.</p>
          )}
        </section>

        <section className="panel full">
          <h2>3) Audit Logs</h2>
          {logsLoading ? <p>Loading logs...</p> : null}
          {logsError ? <p className="error">{logsError}</p> : null}
          {!logsLoading && logs.length === 0 ? (
            <p className="muted">No logs yet.</p>
          ) : (
            <ol className="timeline">
              {logs.map((entry, index) => (
                <li key={`${entry.timestamp || "log"}-${index}`}>
                  <div className="timeline-header">
                    <span className="step">{entry.step}</span>
                    <span className="timestamp">{entry.timestamp}</span>
                  </div>
                  <pre>{formatJson(entry)}</pre>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
