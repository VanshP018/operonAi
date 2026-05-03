# OperonAI

A deterministic AI-powered customer support automation platform that helps modern support teams automate repetitive billing workflows with clear guardrails, auditable decisions, and a human-friendly onboarding flow.

## Features

- **Deterministic AI Agents**: AI-driven classification and decision-making with strict rules and thresholds
- **Multi-Tenant Architecture**: Isolated company data with custom FAQs and configurations
- **Stripe Integration**: Real-time payment processing and automated refunds with idempotency
- **Smart Retrieval (RAG)**: Semantic search through company FAQs using embeddings and cosine similarity
- **Audit Logging**: Complete traceability of all workflow steps
- **React Dashboard**: Beautiful, Zendesk-inspired onboarding UI with dropdown navigation
- **Dry-Run Mode**: Safe testing environment before going live

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **Google Gemini AI** for classification and embeddings
- **Stripe SDK** for payment processing
- **In-memory storage** for multi-tenant data

### Frontend
- **React** with **Vite**
- **CSS** for styling (Zendesk-inspired design)
- **Responsive layout** with full-width components

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key
- Stripe account (for production)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd operonAI
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=3000
   ```

5. **Start the development servers:**
   ```bash
   # Backend (in one terminal)
   npm run dev

   # Frontend (in another terminal)
   cd client && npm run dev
   ```

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.

## Usage

### Onboarding Flow

1. **Visit the homepage** and sign up for a free trial
2. **Navigate to Products > OperonAI Assistant** via the dropdown menu
3. **Connect your Stripe account** for automated refunds
4. **Configure custom FAQs** for your support scenarios
5. **Test rules** in the playground environment
6. **Go live** to start processing tickets automatically

### API Endpoints

#### POST /ticket
Process a customer support ticket with AI classification and automated actions.

**Request Body:**
```json
{
  "userId": "string",
  "message": "string",
  "companyId": "string"
}
```

**Response:**
```json
{
  "classification": "refund_request",
  "decision": "approved",
  "action": "refund",
  "amount": 29.99,
  "confidence": 0.95,
  "auditLog": [...]
}
```

#### GET /faq
Retrieve FAQs for a company.

**Query Parameters:**
- `companyId` (required)

**Response:**
```json
{
  "faqs": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "category": "string"
    }
  ]
}
```

#### POST /faq
Add a new FAQ.

**Headers:**
- `x-company-id`: company identifier

**Request Body:**
```json
{
  "question": "string",
  "answer": "string",
  "category": "string"
}
```

#### DELETE /faq/:id
Delete an FAQ.

**Headers:**
- `x-company-id`: company identifier

## Architecture

### Backend Structure
```
src/
├── app.js                 # Main Express app
├── config/
│   └── stripe.js         # Stripe configuration
├── controllers/
│   └── ticket.controller.js # Main ticket processing logic
├── routes/
│   └── ticket.route.js   # API routes
├── services/
│   ├── aiClassification.service.js # Gemini AI classification
│   ├── decision.service.js         # Deterministic decision logic
│   ├── retrieval.service.js        # RAG implementation
│   ├── stripe.service.js          # Stripe operations
│   └── audit.service.js           # Logging service
├── store/
│   └── company.store.js           # Multi-tenant data storage
├── middleware/
│   └── company.middleware.js      # Company isolation
└── utils/
    └── duplicateDetector.js       # Idempotency checks
```

### Frontend Structure
```
client/src/
├── App.jsx              # Main React component
├── App.css              # Styles
├── components/          # Reusable components
│   ├── ConnectStripe.jsx
│   ├── AddFAQ.jsx
│   ├── FAQList.jsx
│   ├── TestPlayground.jsx
│   └── GoLiveToggle.jsx
└── index.css            # Global styles
```

## Pricing

- **Free Trial**: 1 month free access to all features
- **Standard Plan**: $20/month per company
  - Unlimited deterministic rules
  - Real-time Stripe integration
  - Custom FAQ knowledge base
  - RAG-powered retrieval
  - Multi-tenant isolation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact support@operonai.com or create an issue in this repository.
