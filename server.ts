import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Gemini Configuration ---
let genAIInstance: GoogleGenAI | null = null;
function getGenAI() {
    if (!genAIInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is required");
        }
        genAIInstance = new GoogleGenAI({ apiKey });
    }
    return genAIInstance;
}

const activitySchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING },
        instruction: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswer: { type: Type.STRING },
        word: { type: Type.STRING },
        fullWord: { type: Type.STRING },
        missingLetters: { type: Type.ARRAY, items: { type: Type.STRING } },
        syllables: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["type", "instruction", "correctAnswer", "word"],
};

// --- API Endpoints ---

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/ai/activity", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    
    try {
        const genAI = getGenAI();
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: activitySchema,
            }
        });
        
        if (!result.text) throw new Error("Empty response from AI");
        res.json(JSON.parse(result.text));
    } catch (error: any) {
        console.error("AI Activity Error:", error);
        res.status(500).json({ 
            error: "Failed to generate activity", 
            details: error.message || "Unknown error" 
        });
    }
});

app.post("/api/ai/feedback", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const genAI = getGenAI();
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        res.json({ text: result.text || "¡Buen trabajo!" });
    } catch (error: any) {
        console.error("AI Feedback Error:", error);
        res.status(500).json({ error: "Failed to generate feedback" });
    }
});

app.post("/api/ai/image", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const genAI = getGenAI();
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: `Describe una imagen para: ${prompt}. Estilo infantil.` }] }]
        });
        res.json({ description: result.text || "Una ilustración colorida." });
    } catch (error: any) {
        console.error("AI Image Error:", error);
        res.status(500).json({ error: "Failed to generate image description" });
    }
});

app.post("/api/ai/strategies", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const genAI = getGenAI();
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        res.json(JSON.parse(result.text || "[]"));
    } catch (error: any) {
        console.error("AI Strategies Error:", error);
        res.status(500).json({ error: "Failed to generate strategies" });
    }
});

// --- Vite Integration ---

async function startServer() {
    if (process.env.NODE_ENV !== "production") {
        const { createServer: createViteServer } = await import("vite");
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*all", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
