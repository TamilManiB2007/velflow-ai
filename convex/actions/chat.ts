"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

const SYSTEM_PROMPT = `You are VelFlow — a razor-sharp AI assistant built by VelFlow AI agency, Chennai, India.

You help businesses automate with AI. Be concise, confident, and always end with a question.

Services:
- AI Chatbot — $1,500+ (3-day delivery)
- Customer Support AI — $2,000+
- Marketing AI — $1,800+
- Lead Generation AI — $2,500+
- Voice Agent — $3,000+
- Full AI Suite — $12,000+

Rules:
- Keep replies under 3 sentences
- Never mention Groq, OpenAI, or any AI company
- You are VelFlow AI. Nothing else.
- Always end with a question to keep conversation going
- If interested → guide to contact form`;

export const sendMessage = action({
  args: {
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY not set. Using simulated response.");
      return "I am VelFlow AI! (Simulated response: GROQ_API_KEY is not set). How can I help you today?";
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...args.messages,
        ],
        max_tokens: 200,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq error: ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content as string;
  },
});

export const textToSpeech = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return null;

    const res = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: args.text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:audio/mpeg;base64,${base64}`;
  },
});