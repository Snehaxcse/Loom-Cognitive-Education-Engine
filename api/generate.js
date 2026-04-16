const prompts = {
  summary: (topic) =>
    `Give a concise study summary for: "${topic}". Include key concepts, important points, and a brief overview. Use clear sections.`,
  questions: (topic) =>
    `Generate 5 practice questions for: "${topic}". Mix difficulty levels. Include answers at the end.`,
  flashcards: (topic) =>
    `Create 6 flashcards for: "${topic}". Format each as:\nQ: [question]\nA: [answer]\n\nMake them concise.`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server is missing GROQ_API_KEY configuration." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const topic = body?.topic?.trim();
    const type = body?.type;

    if (!topic) return res.status(400).json({ error: "Topic is required." });
    if (!prompts[type]) return res.status(400).json({ error: "Invalid AI tool type." });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompts[type](topic) }],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || "Groq request failed.";
      return res.status(response.status).json({ error: message });
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ text: text || "" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}
