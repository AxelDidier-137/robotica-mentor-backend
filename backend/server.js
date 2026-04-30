const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// 🧠 memoria global (simple)
let memory = [];

console.log("BACKEND CON MEMORIA 🚀");

app.get("/", (req, res) => {
  res.send("Backend funcionando con memoria 🧠");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // 👉 agregamos el mensaje del usuario a memoria
    memory.push({ role: "user", content: message });

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
            content: "Eres un mentor de robótica exigente. Corriges, explicas y haces pensar al usuario."
          },
          ...memory
        ]
      })
    });

    const data = await response.json();

    let reply = "Sin respuesta";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = "Error IA: " + data.error.message;
    }

    // 👉 guardamos respuesta de la IA también
    memory.push({ role: "assistant", content: reply });

    // 🔥 límite de memoria (evita que crezca infinito)
    if (memory.length > 20) {
      memory = memory.slice(-20);
    }

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Error conectando con IA" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo 🚀");
});