const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 usa la variable EXACTA de Render: API_KEY
const API_KEY = process.env.API_KEY;

// 👉 logs para confirmar
console.log("SERVIDOR ACTUALIZADO 🚀");
console.log("API KEY PRESENTE:", !!API_KEY);

app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!API_KEY) {
    return res.json({ reply: "Error: API_KEY no configurada en Render" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        // 👇 FORZAMOS header correcto
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "Eres un mentor de robótica exigente. Explica claro, corrige errores, da ejemplos en C++ y haz preguntas desafiantes."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("RESPUESTA IA:", JSON.stringify(data));

    let reply = "No hubo respuesta";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = "Error IA: " + data.error.message;
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