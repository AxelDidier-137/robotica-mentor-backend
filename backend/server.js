const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "TU_API_KEY_AQUI";

// memoria simple por usuario (puedes mejorar luego)
let memory = [];

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
Eres un mentor experto en robótica para estudiantes de preparatoria.

Reglas:
- No seas indulgente ni simplista
- Explica a detalle pero claro
- Haz preguntas para desafiar al usuario
- Sugiere mejores soluciones cuando veas errores
- Proporciona ejemplos en C++ cuando sea útil
- Da links útiles cuando aplique
- Mantén tono de mentor, no de amigo relajado
- Ayuda a resolver tareas con enfoque educativo
`
          },
          ...memory,
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "No pude generar respuesta.";

    // guardar memoria
    memory.push({ role: "user", content: message });
    memory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.json({ reply: "Error en IA" });
  }
});

app.listen(3000, () => {
  console.log("Backend listo en puerto 3000 🚀");
});