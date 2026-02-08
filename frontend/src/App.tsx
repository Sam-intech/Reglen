import { useState } from "react";
// ======================================

type AnswerResponse = {
  answer: string;
  sources: string[];
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    setData(await res.json());
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Regulatory QA</h1>

        <textarea
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Ask a regulation question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={ask} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
          Ask
        </button>

        {loading && <p className="opacity-70">Thinking…</p>}

        {data && (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded">
              <h2 className="font-medium">Answer</h2>
              <p className="mt-2 text-sm">{data.answer}</p>
            </div>

            <div className="p-4 bg-zinc-900 rounded">
              <h2 className="font-medium">Sources</h2>
              <ul className="mt-2 text-sm list-disc list-inside">
                {data.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}