import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables for local/serverless testing
dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'vercel-serverless-aether',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS and pre-flight OPTIONS requests
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Only POST is allowed." });
  }

  try {
    const { messages, model, systemInstruction } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array." });
    }

    // Determine target model
    const targetModel = "gemini-3.5-flash"; 

    // Retrieve last message and feed context
    const lastUserMessage = messages[messages.length - 1].text;
    
    const mergedSystemInstruction = systemInstruction || "You are Aether AI, a sophisticated, professional assistant specializing in clear writing, precise debugging, code refactoring, and logical analysis. Structure your output elegantly using human-friendly, simple language and clear markdown formatting. Do not output any simulated hardware status reports, version telemetry, latency measures, memory parameters, or sci-fi workspace optimizer jargon.";

    const ai = getAIClient();
    if (!ai) {
      // Simulate real AI response fallback if Vercel doesn't have an API Key configured yet
      return handleSimulatedChat(lastUserMessage, res);
    }

    // Prepare contents containing full history
    const contents: any[] = [];
    
    // Add context history (last 6 messages to stay fast & light)
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
      return res.status(200).json({ text: responseText, modelUsed: targetModel });
    } catch (genError: any) {
      console.error("Gemini Vercel Generator Error:", genError);
      return res.status(500).json({ 
        error: "Failed to generate content from AI engine: " + (genError.message || genError),
        fallback: true
      });
    }

  } catch (err: any) {
    console.error("Vercel Function Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Mirror the simulation responses on Vercel deployment if offline keys
function handleSimulatedChat(prompt: string, res: VercelResponse) {
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

  // Fast response for serverless runtime
  return res.status(200).json({ text: reply, modelUsed: "simulated-ultra-engine" });
}
