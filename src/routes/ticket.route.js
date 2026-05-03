import { Router } from "express";
import { handleTicket } from "../controllers/ticket.controller.js";
import { getLogs } from "../services/audit.service.js";
import { getCompany } from "../middleware/company.middleware.js";
import {
	addFaq,
	ensureCompany,
	listFaqs,
	removeFaq,
	updateFaq,
} from "../store/company.store.js";
import { getEmbedding, normalize } from "../services/retrieval.service.js";

const router = Router();

router.post("/ticket", getCompany, handleTicket);

router.post("/faq", async (req, res) => {
	const {
		companyId,
		question,
		action,
		limit,
		category,
		stripeCustomerId,
	} = req.body || {};

	if (!companyId || !question || !action || !category) {
		return res.status(400).json({
			status: "error",
			message: "Missing required FAQ fields",
		});
	}

	const company = ensureCompany(companyId, stripeCustomerId);
	if (!company) {
		return res.status(400).json({
			status: "error",
			message: "Invalid companyId",
		});
	}

	const embedding = await getEmbedding(normalize(question));

	const faq = {
		id: `faq_${Date.now()}`,
		question,
		action,
		limit,
		category,
		embedding,
	};

	addFaq(companyId, faq);

	return res.json({
		status: "ok",
		faq,
	});
});

router.get("/faq", getCompany, (req, res) => {
	const faqs = listFaqs(req.companyId).map((faq) => ({
		id: faq.id,
		question: faq.question,
		action: faq.action,
		limit: faq.limit,
		category: faq.category,
	}));

	res.json({
		status: "ok",
		faqs,
	});
});

router.put("/faq/:id", getCompany, async (req, res) => {
	const { question, action, limit, category } = req.body || {};
	const updates = { action, limit, category };

	if (question) {
		updates.question = question;
		updates.embedding = await getEmbedding(normalize(question));
	}

	const updated = updateFaq(req.companyId, req.params.id, updates);

	if (!updated) {
		return res.status(404).json({
			status: "error",
			message: "FAQ not found",
		});
	}

	return res.json({
		status: "ok",
		faq: updated,
	});
});

router.delete("/faq/:id", getCompany, (req, res) => {
	const removed = removeFaq(req.companyId, req.params.id);

	if (!removed) {
		return res.status(404).json({
			status: "error",
			message: "FAQ not found",
		});
	}

	return res.json({
		status: "ok",
		faq: removed,
	});
});
router.get("/logs", (req, res) => {
	res.json({
		status: "ok",
		logs: getLogs(),
	});
});

export default router;
