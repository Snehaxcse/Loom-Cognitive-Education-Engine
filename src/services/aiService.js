import axios from "axios";

// Always use the server-side Vercel API.
const AI_API_URL = "/api/generate";

export async function generateStudyContent(type, topic) {
  if (!topic?.trim()) {
    throw new Error("Please enter a topic.");
  }

  const allowedTypes = ["summary", "questions", "flashcards"];

  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid AI tool selected.");
  }

  try {
    const response = await axios.post(AI_API_URL, {
      type,
      topic: topic.trim(),
    });

    return response.data.text;
  } catch (error) {
    console.error("AI Service Error:", error);

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to generate AI content.";

    throw new Error(message);
  }
}