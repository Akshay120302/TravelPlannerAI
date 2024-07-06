import express from "express"
import { chatBotHandler } from "../controllers/Chatbot.controller.js";

const router = express.Router();

router.post('/gemini', chatBotHandler);

export default router;