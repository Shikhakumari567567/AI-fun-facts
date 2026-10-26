import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;

// Find the current project folder
const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({
  path: path.join(currentDir, ".env")
});

// Connect to Gemini using the API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Serve HTML, CSS, and JavaScript from public
app.use(express.static(path.join(currentDir, "public")));

// GET API: Generate a fun fact
app.get("/fun-fact", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is missing. Check your .env file."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        "Generate one interesting, accurate, family-friendly fun fact. " +
        "Use 1-2 short sentences. Return only the fact."
    });

    const fact = response.text?.trim();

    if (!fact) {
      throw new Error("Gemini returned an empty response.");
    }

    res.json({ fact });
  } catch (error) {
    console.error("Gemini error:", error.message);

    res.status(500).json({
      error: "Could not generate a fun fact. Check the server terminal."
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
