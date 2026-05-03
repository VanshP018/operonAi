import { Router } from "express";
import { handleTicket } from "../controllers/ticket.controller.js";

const router = Router();

router.post("/ticket", handleTicket);

export default router;
