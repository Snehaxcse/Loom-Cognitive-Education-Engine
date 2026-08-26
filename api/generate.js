const prompts = {
  summary: (topic) => `
Give a concise and well-structured study summary for "${topic}".

Include:
- Introduction
- Key Concepts
- Important Points
- Real-world Example (if applicable)
- Quick Revision Notes
`,

  questions: (topic) => `
Generate 5 practice questions on "${topic}".

Mix easy, medium, and difficult questions.
After all questions, provide an answer key.
`,

  flashcards: (topic) => `
Create 6 flashcards for "${topic}".

Format exactly like:

Q: Question
A: Answer

Keep answers short and easy to revise.
`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing from Vercel environment variables.",
    });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { topic, type } = body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Topic is required." });
    }

    if (!prompts[type]) {
      return res.status(400).json({ error: "Invalid AI tool type." });
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompts[type](topic),
            },
          ],
          temperature: 0.6,
          max_tokens: 1000,
        }),
      }
    );

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq Error:", data);
      return res.status(groqResponse.status).json({
        error: data?.error?.message || "Groq request failed.",
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Server Error:", err);

    return res.status(500).json({
      error: "Unexpected server error while generating AI content.",
    });
  }
}