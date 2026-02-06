from fastapi import FastAPI
from pydantic import BaseModel
from qa import run_qa  # you refactor qa.py into a function
# =======================================================================

app = FastAPI()

class Query(BaseModel):
  question: str

@app.post("/ask")
def ask(query: Query):
  answer, sources = run_qa(query.question)
  return {
    "answer": answer,
    "sources": sources
  }