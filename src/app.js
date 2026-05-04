import "dotenv/config";
import express from "express";
import cors from "cors";
import ticketRouter from "./routes/ticket.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { connectDatabase } from "./config/db.js";
import { getStripeClient } from "./config/stripe.js";

const app = express();
const port = process.env.PORT || 3000;

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
app.use(ticketRouter);
app.use('/webhook', webhookRouter);

const startServer = async () => {
  await connectDatabase();
  getStripeClient();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
