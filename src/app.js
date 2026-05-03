import "dotenv/config";
import express from "express";
import ticketRouter from "./routes/ticket.route.js";
import { connectDatabase } from "./config/db.js";
import { getStripeClient } from "./config/stripe.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(ticketRouter);

const startServer = async () => {
  await connectDatabase();
  getStripeClient();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();
