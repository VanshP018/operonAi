import { useState, useEffect } from "react";
import "./App.css";
import { ConnectStripe } from "./components/ConnectStripe";
import { AddFAQ } from "./components/AddFAQ";
import { FAQList } from "./components/FAQList";
import { TestPlayground } from "./components/TestPlayground";
import { GoLiveToggle } from "./components/GoLiveToggle";
import { WebhookRegistration } from "./components/WebhookRegistration";
import { COMPANY_ID, API_KEY, API_BASE_URL } from "./config.js";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/faq?companyId=${COMPANY_ID}`,
        {
          headers: { "x-company-id": COMPANY_ID },
        },
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setFaqs(Array.isArray(data.faqs) ? data.faqs : []);
    } catch {
      console.error("Failed to load FAQs");
    }
  };

  const handleConnectStripe = () => {
    setIsStripeConnected(true);
  };

  const handleFaqAdded = (newFaq) => {
    setFaqs([...faqs, newFaq]);
  };

  const handleDeleteFaq = async (faqId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faq/${faqId}`, {
        method: "DELETE",
        headers: { "x-company-id": COMPANY_ID },
      });

      if (response.ok) {
        setFaqs(faqs.filter((faq) => faq.id !== faqId));
      }
    } catch {
      console.error("Failed to delete FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLive = () => {
    setIsLive(!isLive);
  };

  return (
    <div className="app">
      <div className="top-banner">
        <span>Experience the future of agentic service from anywhere, join us on 28 May for the leading service event of the year. <a href="#">Register for free</a></span>
      </div>
      <header className="navbar">
        <div className="brand" onClick={() => setCurrentView("home")} style={{cursor: 'pointer'}}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <polygon points="4,4 12,12 20,4"></polygon>
            <polygon points="4,20 12,12 20,20"></polygon>
            <line x1="4" y1="4" x2="4" y2="20"></line>
          </svg>
          operonAI
        </div>
        <nav className="nav-links">
          <div className="nav-dropdown">
            <a href="#products" className="nav-item">Products</a>
            <div className="dropdown-content">
              <a href="#assistant" onClick={(e) => { e.preventDefault(); setCurrentView("assistant"); }}>OperonAI Assistant</a>
            </div>
          </div>
          <a href="#pricing" className="nav-item">Pricing</a>
          <a href="#about" className="nav-itemng">Pricing</a>
          <a href="#about">About Us</a>
        </nav>
        <div className="nav-actions">
          <a href="#" className="nav-secondary-link">Sign in</a>
          <button className="btn btn-primary pill">Try it for free</button>
          <button className="btn btn-secondary pill">View demo</button>
        </div>
      </header>

      {currentView === "home" && (
        <>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Deliver beautifully simple service<br/>with Operon AI agents</h1>
            <p className="subtitle">
              Powering over 20,000 AI customers and counting
            </p>
            <div className="hero-email-form">
              <span className="trial-text"><strong>14-day free trial.</strong> No credit card required.</span>
              <div className="email-input-group">
                <input type="email" placeholder="cansh.panwar2024@nst.rishihood.edu.in" />
                <button className="btn btn-primary">Try it for free</button>
              </div>
              <span className="terms-text">By submitting, I agree to OperonAI's <a href="#">Privacy Notice</a>.</span>
            </div>
          </div>
        </section>

        <section className="home-pricing" id="pricing">
          <div className="pricing-container">
            <h2>Simple, transparent pricing</h2>
            <p className="pricing-subtitle">Start automating your customer service today without breaking the bank.</p>
            
            <div className="pricing-card">
              <div className="pricing-badge">Most Popular</div>
              <h3>OperonAI Assistant</h3>
              <div className="price-block">
                <span className="price">$20</span>
                <span className="period">/month</span>
              </div>
              <p className="price-promo">Free for your 1st month.</p>
              
              <ul className="pricing-features">
                <li>✨ Unlimited deterministic rules</li>
                <li>✨ Real-time Stripe integration</li>
                <li>✨ Custom FAQ knowledge base</li>
                <li>✨ Beautiful RAG playground</li>
                <li>✨ Live multi-tenant isolation</li>
              </ul>
              
              <button className="btn btn-primary pill pricing-btn">Start your 1-month free trial</button>
            </div>
          </div>
        </section>
      </>
      )}

      {currentView === "assistant" && (
        <main className="main">
          <div className="assistant-header" style={{marginBottom: '32px', textAlign: 'left'}}>
            <h1>OperonAI Assistant Setup</h1>
            <p>Configure your deterministic support agent.</p>
          </div>

          <ConnectStripe
            isConnected={isStripeConnected}
            onConnect={handleConnectStripe}
          />

          <section className="section">
            <h2>2. Configure Rules</h2>
            <p className="section-desc">
              Define rules for how the system should handle different customer
              messages.
            </p>

            <AddFAQ
              companyId={COMPANY_ID}
              onFaqAdded={handleFaqAdded}
              loading={loading}
            />

            <div className="section-divider">
              <h3>Your Rules</h3>
            </div>

            <FAQList
              faqs={faqs}
              onDeleteFaq={handleDeleteFaq}
              loading={loading}
            />
          </section>

          <TestPlayground companyId={COMPANY_ID} />

          <GoLiveToggle isEnabled={isLive} onToggle={handleToggleLive} />

          <WebhookRegistration companyId={COMPANY_ID} apiKey={API_KEY} />

          <section className="section section-footer" id="pricing">
            <h2>Next Steps</h2>
            <ul className="steps-list">
              <li>Connect your Stripe account to enable automatic refunds</li>
              <li>Add rules that match your support scenarios</li>
              <li>Test rules using the playground above</li>
              <li>Enable automation to start processing tickets automatically</li>
            </ul>
          </section>

          <section className="section section-footer" id="about">
            <h2>About OperonAI Assistant</h2>
            <p className="section-desc">
              OperonAI helps modern support teams automate repetitive billing
              workflows with clear guardrails, auditable decisions, and a human
              friendly onboarding flow.
            </p>
          </section>
        </main>
      )}

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <polygon points="4,4 12,12 20,4"></polygon>
                <polygon points="4,20 12,12 20,20"></polygon>
                <line x1="4" y1="4" x2="4" y2="20"></line>
              </svg>
              <span>operonAI</span>
            </div>
            <p>Automate repetitive workflows with simple deterministic AI agents. The future of customer service is here.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Products</h4>
              <a href="#">Agentic Support</a>
              <a href="#">Smart Routing</a>
              <a href="#">Integrations</a>
            </div>
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 OperonAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
