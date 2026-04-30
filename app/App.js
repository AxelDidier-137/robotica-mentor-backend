import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    if (!text.trim()) return;

    setChat(prev => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("https://robotica-mentor-backend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      setChat(prev => [...prev, { role: "assistant", content: data.reply }]);
      setText("");

    } catch (e) {
      setChat(prev => [...prev, { role: "assistant", content: "Error 😞" }]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        {chat.map((m, i) => (
          <Text key={i} style={{ marginBottom: 10 }}>
            {m.role === "user" ? "Tú: " : "Mentor: "}
            {m.content}
          </Text>
        ))}
      </ScrollView>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Pregunta..."
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TouchableOpacity onPress={send} style={{ backgroundColor: "blue", padding: 15 }}>
        <Text style={{ color: "white" }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}