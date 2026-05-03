import { useState } from "react";

export function ConnectStripe({ isConnected, onConnect }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>1. Connect Stripe</h2>
        <span className="status-badge">
          {isConnected ? "✅ Connected" : "❌ Not Connected"}
        </span>
      </div>

      {!isConnected ? (
        <button className="btn btn-primary" onClick={onConnect}>
          Connect Stripe
        </button>
      ) : (
        <p className="success-text">Stripe is connected and ready to use.</p>
      )}
    </section>
  );
}
