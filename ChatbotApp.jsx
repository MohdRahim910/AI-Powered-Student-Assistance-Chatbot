import { useEffect, useRef, useState } from "react";
import axios from "axios";
import './App.css';

const suggestions = [
  "Overview of Presidency University?",
  "What are the opportunity offered in Presidency University.",
  "What is the Admission process?",
  "How to contact Presidency University",
  "Courses offered in 3rd semester",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/chat", { messages: newMessages });
      setMessages([...newMessages, { role: "assistant", content: res.data.response }]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => setInput(suggestion);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <h1>AI Chatbot Assistant for Presidecny University🤖</h1>

      <button className="dark-toggle" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="suggestions">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => handleSuggestionClick(s)}>
            {s}
          </button>
        ))}
      </div>

      <div id="chat-window">
  {messages.map((msg, idx) => (
    <div key={idx} className="message-row" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
      <div className={msg.role === "user" ? "user-msg" : "bot-msg"}>
        {msg.content}
      </div>
    </div>
  ))}
  {loading && (
    <div className="message-row" style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div className="bot-msg">Assistant is typing...</div>
    </div>
  )}
  <div ref={bottomRef}></div>
</div>


      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Ask</button>
      </div>
    </div>
  );
}
