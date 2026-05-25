import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or contains placeholder. Falling back to built-in simulation engine.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Full-featured proxy endpoint for querying Gemini models
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model, systemInstruction } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array." });
    }

    // Determine target model
    const targetModel = model === "ultra" ? "gemini-3.5-flash" : "gemini-3.5-flash"; 

    // Retrieve last message and feed context
    const lastUserMessage = messages[messages.length - 1].text;
    
    // Construct rich history mapping for the model
    // Convert array format to expected structure or send current prompt with context
    // We can bundle systemInstruction + conversation context directly as systemInstructions or part of contents
    const mergedSystemInstruction = systemInstruction || "You are Aether AI, a sophisticated, professional assistant specializing in clear writing, precise debugging, code refactoring, and logical analysis. Structure your output elegantly using human-friendly, simple language and clear markdown formatting. Do not output any simulated hardware status reports, version telemetry, latency measures, memory parameters, or sci-fi workspace optimizer jargon.";

    const ai = getAIClient();
    if (!ai) {
      // Elegant fallback simulation responses if offline / no API key configured
      return handleSimulatedChat(lastUserMessage, res);
    }

    // Prepare contents containing full history for simple context
    const contents: any[] = [];
    
    // Add history
    messages.slice(-6).forEach((msgObj: any) => {
      const parts: any[] = [{ text: msgObj.text || "" }];
      
      if (msgObj.images && Array.isArray(msgObj.images)) {
        msgObj.images.forEach((img: string) => {
          if (img.startsWith('data:')) {
            const match = img.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
            if (match) {
              parts.push({
                inlineData: {
                  mimeType: match[1],
                  data: match[2]
                }
              });
            }
          } else if (img.startsWith('http')) {
            parts.push({ text: `\n[Reference Image: ${img}]` });
          }
        });
      }

      contents.push({
        role: msgObj.sender === "user" ? "user" : "model",
        parts: parts
      });
    });

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents: contents,
        config: {
          systemInstruction: mergedSystemInstruction,
          temperature: 0.75,
        }
      });
      
      const responseText = response.text || "I processed your request, but did not generate any text output.";
      return res.json({ text: responseText, modelUsed: targetModel });
    } catch (genError: any) {
      console.error("Gemini Generation Error:", genError);
      return res.status(500).json({ 
        error: "Failed to generate content from AI engine: " + (genError.message || genError),
        fallback: true
      });
    }

  } catch (err: any) {
    console.error("Endpoint system error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// A rich simulated model that provides stunning, high-fidelity mock replies for offline and preview states
function handleSimulatedChat(prompt: string, res: express.Response) {
  const lower = prompt.toLowerCase();
  let reply = "";

  if (lower.includes("temporal") && lower.includes("spatial")) {
    reply = `### Spatial vs. Temporal Consistency in Video Models

Here is a clear comparison of these core visual concepts:

*   **Spatial Consistency**: This refers to the visual coherence, proportion, and alignment within a single static frame. It ensures that textures, lighting, geometry, and object features look correct and logical on their own.
*   **Temporal Consistency**: This concerns the continuity of features and movements across time (from one frame to the next). It ensures that motion is fluid and that objects do not randomly warp, transform, or flicker as the video plays.

Both paradigms are key to producing stable, high-quality video content from AI models.`;
  } else if (lower.includes("debug") || lower.includes("code") || lower.includes("error")) {
    reply = `### Debugging diagnostic overview

Here is an analysis and refactoring suggestion for your database or connection handler query:

\`\`\`typescript
export function stabilizeConnection(servers: string[], timeoutMs: number) {
  if (timeoutMs <= 0) {
    throw new Error("Timeout limit must be positive.");
  }
  return Promise.all(
    servers.map(async (host) => {
      // Connect with error recovery and timing fallbacks
      return connectWithBackoff(host, timeoutMs);
    })
  );
}
\`\`\`

1.  **Connection Management**: Handled with exponential backoff to handle transient network drops.
2.  **Timeout Limits**: Ensures server queries fail fast rather than hanging indefinitely.
3.  **Concurrency**: Resolves connection states in parallel for maximum scheduling performance.`;
  } else if (lower.includes("analysis") || lower.includes("schema") || lower.includes("market")) {
    reply = `### Architecture & Schema Overview

Here is a summary of the database schema design:

*   **Standard Interface**: The schema endpoints conform to OpenAPI protocols for universal client compatibility.
*   **Database Constraints**: Foreign keys are indexed appropriately to maintain speedy queries under high read loads.
*   **Recommendations**: Run full test cases in a sandbox database before rolling out database migrations in production.`;
  } else {
    reply = `Hello! How can I assist you with your projects today?

I can help with:
1.  **Drafting documentation, specifications, and articles**.
2.  **Refactoring and debugging TypeScript, Python, or SQL queries**.
3.  **Designing clean JSON/YAML dataset schemas**.

Feel free to choose a prompt template or type your thoughts directly below!`;
  }

  // Slightly delay the reply to simulate computation realistically
  setTimeout(() => {
    res.json({ text: reply, modelUsed: "simulated-ultra-engine" });
  }, 1000);
}

// Vite integration middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aether Platform] Full-stack engine listening on port ${PORT}`);
  });
}

startServer();
