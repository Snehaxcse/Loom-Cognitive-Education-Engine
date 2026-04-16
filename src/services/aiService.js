import axios from "axios";

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "/api/generate";
const LOCAL_GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const isLikelyGroqKey = (value) => typeof value === "string" && value.startsWith("gsk_");

/**
 * generateStudyContent
 *
 * This function handles calling the AI API to get answers.
 *
 * @param {string} type - "summary", "questions", or "flashcards"
 * @param {string} topic - The topic the user typed in
 * @returns {string} The text response from the AI
 */
export async function generateStudyContent(type, topic) {
  const prompts = {
    summary: `Give a concise study summary for: "${topic}". Include key concepts, important points, and a brief overview. Use clear sections.`,
    questions: `Generate 5 practice questions for: "${topic}". Mix difficulty levels. Include answers at the end.`,
    flashcards: `Create 6 flashcards for: "${topic}". Format each as:\nQ: [question]\nA: [answer]\n\nMake them concise.`,
  };

  const selectedPrompt = prompts[type];
  if (!selectedPrompt) throw new Error("Unsupported AI tool selected.");
  if (!topic?.trim()) throw new Error("Topic is required.");

  try {
    // Local-only fallback: convenient during development, but never safe for public deployments.
    if (LOCAL_GROQ_API_KEY) {
      if (!isLikelyGroqKey(LOCAL_GROQ_API_KEY)) {
        throw new Error(
          "VITE_GROQ_API_KEY is not a Groq key. Use a key that starts with 'gsk_'."
        );
      }

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: selectedPrompt }],
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOCAL_GROQ_API_KEY}`,
          },
        }
      );

      return response.data.choices[0]?.message?.content?.trim() || "";
    }

    if (AI_API_URL === "/api/generate") {
      throw new Error(
        "No local Groq key found. Set VITE_GROQ_API_KEY for local dev, or deploy and set server-side GROQ_API_KEY."
      );
    }

    const response = await axios.post(AI_API_URL, { type, topic });
    return response.data?.text?.trim() || "";
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to generate AI content.";
    throw new Error(message);
  }
}
