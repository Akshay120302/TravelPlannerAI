import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../models/ChatHistory.model.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

export const chatBotHandler = async (req, res) => {
    try {
      const { history, message } = req.body;
  
      // Check if history is an array and validate the structure of each item
      if (!Array.isArray(history)) {
        throw new Error("Invalid history format: history should be an array.");
      }
  
      history.forEach((item, index) => {
        if (
          typeof item !== 'object' ||
          !item.role ||
          !Array.isArray(item.parts) ||
          item.parts.some(part => typeof part !== 'string')
        ) {
          throw new Error(`Invalid history item structure at index ${index}`);
        }
      });
  
      // Ensure message is a valid string
      if (typeof message !== 'string' || message.trim() === "") {
        throw new Error("Invalid message format: message should be a non-empty string.");
      }
  
      // Rest of your logic...
    } catch (error) {
      console.error("Error in chatBotHandler:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  

export const chatHistoryUpdate = async (req, res) => {
    const { chatHistory } = req.body;
  
    // Ensure chatHistory is an array and validate its structure
    if (!Array.isArray(chatHistory)) {
      return res.status(400).json({ message: "Invalid chat history format." });
    }
  
    try {
      const existingChat = await ChatHistory.findOneAndUpdate(
        { userId: req.user._id },
        { chatHistory, updatedAt: Date.now() },
        { new: true, upsert: true } // upsert: true will create a new document if one doesn't exist
      );
  
      res.json(existingChat);
    } catch (error) {
      console.error("Error updating chat history:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const saveChatHistoryHandler = async (req, res) => {
    try {
      const { chatHistory } = req.body;
  
      // Validate that chatHistory is an array
      if (!Array.isArray(chatHistory)) {
        return res.status(400).json({ error: "Invalid chatHistory format: should be an array." });
      }
  
      // Validate each history item
      chatHistory.forEach((chatItem, index) => {
        if (!chatItem.role || !Array.isArray(chatItem.parts)) {
          throw new Error(`Invalid format in chat item at index ${index}`);
        }
      });
  
      // Proceed with saving the chat history (e.g., to MongoDB)
      // ChatHistory.create({ userId: req.user._id, chatHistory });
  
      return res.status(200).json({ success: true, message: "Chat history saved successfully." });
    } catch (error) {
      console.error("Error in saveChatHistoryHandler:", error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  export const fetchChatHistoryHandler = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming you have user authentication and can get the user ID
  
      if (!userId) {
        return res.status(400).json({ error: "No user ID provided." });
      }
  
      const chatHistory = await ChatHistory.findOne({ userId });
  
      if (!chatHistory) {
        return res.status(404).json({ error: "Chat history not found." });
      }
  
      return res.status(200).json({ chatHistory: chatHistory.chatHistory });
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
      return res.status(500).json({ error: error.message });
    }
  };
  
  
  