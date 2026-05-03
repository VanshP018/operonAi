export function GoLiveToggle({ isEnabled, onToggle }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>4. Go Live</h2>
        <span className="status-badge">
          {isEnabled ? "🟢 Enabled" : "🔴 Disabled"}
        </span>
      </div>

      <div className="toggle-container">
        <button
          className={`toggle ${isEnabled ? "active" : ""}`}
          onClick={onToggle}
        >
          <div className="toggle-switch"></div>
          <span>{isEnabled ? "Automation Enabled" : "Automation Disabled"}</span>
        </button>

        <div className="toggle-info">
          {isEnabled ? (
            <p className="success-text">
              ✅ Automation is live. The system will automatically process
              tickets according to your rules.
            </p>
          ) : (
            <p>
              When enabled, the system will automatically process support
              tickets using your configured rules.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
