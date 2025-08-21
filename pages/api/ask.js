export default async function handler(req, res) {
  try {
    const { message } = JSON.parse(req.body);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'http://localhost:3000/', // Required by OpenRouter
  'X-Title': 'MyFirstAgent'
}
,
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ reply: "Error from Claude/OpenRouter: " + (data.error?.message || "Unknown error") });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Internal server error" });
  }
}
