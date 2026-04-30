const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// Logs
console.log("SERVIDOR ACTUALIZADO 🚀");
console.log("API KEY PRESENTE:", !!API_KEY);

app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!API_KEY) {
    return res.json({ reply: "Error: API_KEY no configurada" });
  }

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
            content: "Eres un mentor de robótica exigente. Explica claro, corrige errores, da ejemplos en C++ y haz preguntas desafiantes."
          },
          { role: "user", content: message }
        ]
      })
    });

    console.log("STATUS:", response.status);

    const text = await response.text();
    console.log("RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({ reply: "Respuesta inválida del servidor IA" });
    }

    let reply = "No hubo respuesta";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = "Error IA: " + data.error.message;
    }

    res.json({ reply });

  } catch (err) {
    console.log("ERROR FETCH:", err);
    res.json({ reply: "Error conectando con IA 😞" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo 🚀");
});