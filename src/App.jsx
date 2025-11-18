import { useState } from "react";
import { personalities, sendMessage } from "./ai/ai";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import "./index.css";
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [personality, setPersonality] = useState(personalities[1].name);
  const [selectedPersonality, setSelectedPersonality] = useState(false);
  const handleStream = async (userInput) => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");

    const aiMessageIndex = messages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await sendMessage(
      userInput,
      (accumulatedText) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[aiMessageIndex + 1].content = accumulatedText;
          return updated;
        });
      },
      personality
    );
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#282c34",
          padding: "20px",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <header
          style={{
            marginBottom: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "calc(16px + 2vmin)",
              fontWeight: "600",
              margin: "0",
            }}
          >
            AI Chat
          </h1>
        </header>
        <div
          style={{
            width: "80%",
            maxWidth: "80vw",
            height: messages.length === 0 ? "80px" : "500px",
            minHeight: "50px",
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "#1a1a2e",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            transition: "height 0.3s ease-in-out",
          }}
        >
          <ScrollArea className="h-full w-full">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {messages.length < 1 && !selectedPersonality ? (
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {
                      setSelectedPersonality(true);
                      setPersonality(personalities[0].name);
                    }}
                  >
                    {personalities[0].name}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPersonality(true);
                      setPersonality(personalities[1].name);
                    }}
                  >
                    {personalities[1].name}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPersonality(true);
                      setPersonality(personalities[2].name);
                    }}
                  >
                    {personalities[2].name}
                  </Button>
                </div>
              ) : null}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem",
                    backgroundColor:
                      msg.role === "user" ? "#2a4a7c" : "#1a3a5c",
                    borderRadius: "8px",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "calc(10px + 0.5vmin)",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    {msg.role === "user" ? "You: " : "AI: "}
                  </strong>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex gap-4 w-full max-w-4xl justify-center items-center">
          <Input
            variant="ghost"
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleStream(input);
              }
            }}
          />
          {selectedPersonality && messages.length > 1 ? (
            <Select
              value={personality}
              onValueChange={(value) => setPersonality(value)}
            >
              <SelectTrigger>
                <SelectValue />
                <SelectContent>
                  {personalities.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          ) : null}

          <Button variant="ghost" onClick={() => handleStream(input)}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
