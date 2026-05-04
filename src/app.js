import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ticketRouter from "./routes/ticket.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { connectDatabase } from "./config/db.js";
import { getStripeClient } from "./config/stripe.js";

const app = express();
const port = process.env.PORT || 3000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS for production and development
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);

// API routes
app.use(ticketRouter);
app.use('/webhook', webhookRouter);

// Serve static files from the frontend build in production
const frontendBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(frontendBuildPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/faq") || req.path.startsWith("/ticket") || req.path.startsWith("/webhook")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const startServer = async () => {
  await connectDatabase();
  getStripeClient();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
