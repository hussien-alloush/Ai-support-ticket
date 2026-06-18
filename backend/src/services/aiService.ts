import { openai } from "../config/openai";
import { AITicketAnalysis } from "../types";

const SYSTEM_PROMPT = `You are a support ticket triage assistant for a software company.
Given a customer's support ticket, analyze it and respond with ONLY a valid JSON object
(no markdown, no extra text) with exactly these keys:

{
  "category": one of ["billing", "technical", "account", "feature_request", "other"],
  "priority": one of ["low", "medium", "high", "urgent"],
  "suggestedReply": a short, polite, professional draft reply (2-4 sentences) the support agent can edit and send,
  "reasoning": one sentence explaining why you chose this category and priority
}

Rules for priority:
- "urgent": service is completely down, data loss, security issue, payment failure blocking business
- "high": a major feature is broken, affects many users
- "medium": a feature is broken but has a workaround, or affects one user
- "low": general question, minor cosmetic issue, feature request

Return ONLY the JSON object, nothing else.`;

/**
 * Sends ticket text to OpenAI and returns a structured analysis:
 * category, priority, a suggested reply, and the reasoning behind it.
 *
 * This is the core "AI feature" of the app — everything else (auth, CRUD,
 * sockets) is infrastructure you already know. This function is the new piece.
 */
export const analyzeTicket = async (
  subject: string,
  description: string
): Promise<AITicketAnalysis> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3, // lower temperature = more consistent categorization
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Subject: ${subject}\n\nDescription: ${description}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("OpenAI returned an empty response");
    }

    const parsed = JSON.parse(raw) as AITicketAnalysis;

    // Defensive fallback in case the model returns something unexpected
    return {
      category: parsed.category ?? "other",
      priority: parsed.priority ?? "medium",
      suggestedReply:
        parsed.suggestedReply ??
        "Thank you for reaching out. A member of our support team will follow up shortly.",
      reasoning: parsed.reasoning ?? "Default fallback classification.",
    };
  } catch (error) {
    console.error("AI ticket analysis failed:", error);

    // If OpenAI fails (rate limit, network, bad key), don't crash the request —
    // fall back to a safe default so ticket creation still succeeds.
    return {
      category: "other",
      priority: "medium",
      suggestedReply:
        "Thank you for contacting support. We've received your ticket and will respond as soon as possible.",
      reasoning: "AI analysis unavailable; default classification applied.",
    };
  }
};
