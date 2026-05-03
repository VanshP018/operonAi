import "dotenv/config";
import express from "express";
import cors from "cors";
import ticketRouter from "./routes/ticket.route.js";
import { connectDatabase } from "./config/db.js";
import { getStripeClient } from "./config/stripe.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  }),
);
app.use(ticketRouter);

const startServer = async () => {
  await connectDatabase();
  getStripeClient();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
