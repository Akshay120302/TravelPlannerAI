import express from "express";
import { chatBotHandler, chatHistoryHandler, chatHistoryUpdate } from "../controllers/Chatbot.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/gemini', chatBotHandler);

router.get("/history", verifyToken, chatHistoryHandler);

router.post("/history", verifyToken, chatHistoryUpdate);

export default router;
