import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../models/ChatHistory.model.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

export const chatBotHandler = async (req, res, next) => {
    try {
        const { history, message } = req.body;

        if (!Array.isArray(history) || typeof message !== 'string') {
            throw new Error("Invalid history or message format");
        }

        // Log the incoming request data for debugging
        console.log("Valid request received:", { history, message });

        const validatedHistory = history.map((item, index) => {
            if (typeof item !== 'object' || !item.role || !Array.isArray(item.parts)) {
                throw new Error(`Invalid history item structure at index ${index}`);
            }

            // Log each history item to verify the structure
            console.log(`Validated history item at index ${index}:`, item);

            return {
                role: item.role,
                parts: item.parts
            };
        });

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({ history: validatedHistory });

        const result = await chat.sendMessage(message);

        if (!result || !result.response || typeof result.response.text !== 'function') {
            throw new Error("Invalid response from AI model");
        }

        const response = await result.response.text();

        console.log("Response from model:", response);

        res.json({ response });
    } catch (error) {
        console.error("Error in chatBotHandler:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const chatHistoryHandler = async (req, res) => {
    try {
        const existingChat = await ChatHistory.findOne({ userId: req.user._id });
        if (!existingChat) {
            return res.status(404).json({ message: "No chat history found for this user." });
        }
        res.json(existingChat);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const chatHistoryUpdate = async (req, res) => {
    const { chatHistory } = req.body;
    try {
        const existingChat = await ChatHistory.findOneAndUpdate(
            { userId: req.user._id },
            { chatHistory, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(existingChat);
    } catch (error) {
        console.error("Error updating chat history:", error);
        res.status(500).json({ message: "Server error" });
    }
};
