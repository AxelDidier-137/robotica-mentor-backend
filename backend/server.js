const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

console.log("BACKEND NUEVO ACTIVO 🚀");
console.log("API KEY:", !!API_KEY);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Eres un mentor de robótica exigente. Explica bien, corrige, y da ejemplos en C++."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("RESPUESTA IA:", data);

    let reply = "Sin respuesta";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = "Error IA: " + data.error.message;
    }

    res.json({ reply });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ reply: "Error conectando con IA" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo 🚀");
});