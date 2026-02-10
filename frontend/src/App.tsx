import { useEffect, useRef, useState } from "react";
import { askQuestion } from "./api";
// ==================================================


type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setLoading(true);

    // add user message
    setMessages((m) => [...m, { role: "user", content: question }]);

    try {
      const answer = await askQuestion(question);
      typeWriter(answer || "NOT FOUND");
    } catch (err) {
      console.error(err);
      typeWriter("Backend error. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  // typewriter effect for assistant
  const typeWriter = (text: string) => {
    let i = 0;
    let current = "";

    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      current += text[i] ?? "";
      i++;

      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: current,
        };
        return copy;
      });

      if (i >= text.length) clearInterval(interval);
    }, 15);
  };

  return (
    <div className="h-screen bg-neutral-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 text-lg font-semibold">
        Regulatory QA
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-2xl px-4 py-3 rounded-lg whitespace-pre-wrap leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-indigo-600"
                : "mr-auto bg-neutral-800"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-neutral-800 px-4 py-3 rounded-lg text-neutral-400">
            Thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a regulation question…"
            rows={2}
            className="flex-1 resize-none bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}