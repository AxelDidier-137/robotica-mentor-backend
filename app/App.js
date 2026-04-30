import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setChat([...chat, userMsg]);

    try {
      const res = await fetch("https://robotica-mentor.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      const aiMsg = { role: "assistant", content: data.reply };

      setChat(prev => [...prev, aiMsg]);
      setText("");

    } catch (e) {
      setChat(prev => [
        ...prev,
        { role: "assistant", content: "Error conectando 😞" }
      ]);
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
        placeholder="Pregunta de robótica..."
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 8
        }}
      />

      <TouchableOpacity
        onPress={send}
        style={{
          backgroundColor: "#2563eb",
          padding: 15,
          borderRadius: 10,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white" }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}