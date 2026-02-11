import { useEffect, useRef, useState } from "react";
import { askQuestion } from "./api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setLoading(true);

    // Keep previous messages, add new user message
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const answer = await askQuestion(question);
      typeWriter(answer);
    } catch {
      typeWriter("Backend error. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  const typeWriter = (text: string) => {
    let i = 0;
    let current = "";

    // Add empty assistant message at the end
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      current += text[i] ?? "";
      i++;

      setMessages((m) => {
        // Find last assistant message and update its content
        const copy = [...m];
        // Find the last assistant message index
        const lastAssistant = copy.map(msg => msg.role).lastIndexOf("assistant");
        if (lastAssistant !== -1) {
          copy[lastAssistant] = { role: "assistant", content: current };
        }
        return copy;
      });

      if (i >= text.length) clearInterval(interval);
    }, 14);
  };

  return (
    <div className="h-screen bg-neutral-900 text-white flex flex-col">
      {/* Header with centered logo */}
      <header className="w-full border-b border-neutral-800 py-4 flex justify-center items-center">
        <img
          src="/RAG_logo.svg"
          alt="Logo"
          className="h-12 w-12 rounded cursor-pointer"
          onClick={() => {
            setMessages([]);
            setInput("");
            setLoading(false);
          }}
        />
      </header>
      {/* Empty state */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <h1 className="w-[450px] text-center text-3xl font-medium text-neutral-200">
            What do you want to know about financial regulations?
          </h1>

          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-3">
              {/* + sign removed */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none placeholder-neutral-400"
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={send}
                className="bg-white text-black rounded-full px-4 py-1 text-sm font-medium"
              >
                →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-6 py-10">
            <div className="max-w-3xl mx-auto space-y-10">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="flex justify-end"
                  >
                    <div className="bg-neutral-800 text-neutral-100 rounded-xl px-5 py-4 max-w-[70%] text-right shadow-md">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex justify-start"
                  >
                    <div className="bg-transparent text-neutral-200 rounded-xl px-5 py-4 max-w-[70%] text-left">
                      {m.content}
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="text-neutral-500">Thinking…</div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Bottom input */}
          <div className="border-t border-neutral-800 p-4">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-3">
              {/* + sign removed */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                rows={1}
                className="flex-1 resize-none bg-transparent outline-none placeholder-neutral-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                className="bg-white text-black rounded-full px-4 py-1 text-sm font-medium disabled:opacity-50"
              >
                →
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-neutral-500">
              Reglen can make mistakes. Always verify critical information from official sources.
            </p>
          </div>
        </>
      )}
    </div>
  );
}