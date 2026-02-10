const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function askQuestion(question: string): Promise<string> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Backend error");
  }

  const data = await res.json();
  return data.answer;
}