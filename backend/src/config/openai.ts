import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "WARNING: OPENAI_API_KEY is not set. AI features will not work until you add it to your .env file."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
