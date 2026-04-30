const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 API KEY (debe existir en Render como API_KEY)
const API_KEY = process.env.API_KEY;

// 👇 logs para confirmar que sí se actualizó
console.log("SERVIDOR ACTUALIZADO 🚀");
console.log("API KEY:", API_KEY);

let memory = [];

app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Eres un mentor de robótica exigente. Explica claro, corrige errores, da ejemplos en C++ y haz preguntas."
          },
          ...memory,
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    console.log("RESPUESTA IA:", JSON.stringify(data, null, 2));

    let reply = "No hubo respuesta válida";

    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message?.content || data.choices[0].text;
    } else if (data.error) {
      reply = "Error IA: " + data.error.message;
    } else {
      reply = JSON.stringify(data);
    }

    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: reply });

    if (memory.length > 20) memory = memory.slice(-20);

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Error conectando con IA" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo 🚀");
});