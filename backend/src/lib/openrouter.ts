import { OpenAI } from "openai";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Initialize the client ONCE
export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://localhost:3000",
    "X-Title": "Express Chat App",
  }
});