export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const isModels = req.query?.endpoint === "models" || req.url.includes("models");
  const target = isModels 
    ? "https://api.groq.com/openai/v1/models"
    : "https://api.groq.com/openai/v1/chat/completions";

  try {
    const groqRes = await fetch(target, {
      method: isModels ? "GET" : "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: isModels ? undefined : JSON.stringify(req.body)
    });

    const data = await groqRes.json();
    return res.status(groqRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
        }

