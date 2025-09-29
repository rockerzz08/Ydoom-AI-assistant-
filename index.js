import express from "express";
import fetch from "node-fetch";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;

const client = new OpenAI({ apiKey: OPENAI_API_KEY });
const SERP_API_URL = "https://serpapi.com/search.json";

async function webSearch(query) {
  try {
    const url = `${SERP_API_URL}?q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.organic_results) return "No live data found.";
    return data.organic_results
      .slice(0, 5)
      .map(r => `- ${r.title} (${r.link})`)
      .join("\n");
  } catch (err) {
    console.error(err);
    return "⚠️ Error fetching live data.";
  }
}

app.post("/chat", async (req, res) => {
  try {
    const { query } = req.body;
    const liveData = await webSearch(query);

    const systemPrompt = `
You are a Universal AI Assistant with real-time web access.
- Use the live search results below to answer accurately.
- Detect the user's input language automatically.
- Answer in the same language.
- Format responses clearly with headings, lists, tables if needed.
- Include links when possible.

Live search results:
${liveData}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ AI Assistant running on port ${PORT}`));
