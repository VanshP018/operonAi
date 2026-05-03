import { Router } from "express";
import { handleTicket } from "../controllers/ticket.controller.js";
import { getLogs } from "../services/audit.service.js";

const router = Router();

router.post("/ticket", handleTicket);
router.get("/logs", (req, res) => {
	res.json({
		status: "ok",
		logs: getLogs(),
	});
});

export default router;
