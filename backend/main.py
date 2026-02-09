from fastapi import FastAPI
from pydantic import BaseModel
import asyncio
from qa import run_qa  # you refactor qa.py into a function
# =======================================================================

app = FastAPI()

class Query(BaseModel):
  question: str

@app.post("/ask")
async def ask(query: Query):
  answer = await asyncio.to_thread(run_qa, query.question)
  return {
    "answer": answer,
    # "sources": sources
  }


@app.get("/")
def health():
  return {"status": "ok"}