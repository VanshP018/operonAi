// src/routes/webhook.route.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { processWebhook, registerWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// POST /webhook
router.post('/', authenticate, processWebhook);

// POST /register-webhook
router.post('/register', authenticate, registerWebhook);

export default router;