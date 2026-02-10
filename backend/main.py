import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from qa import run_qa  # you refactor qa.py into a function
# =======================================================================

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173"],
  # allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],  
)

class Query(BaseModel):
  question: str

@app.post("/ask")
async def ask(query: Query):
  answer = await asyncio.to_thread(run_qa, query.question)
  return {
    "answer": answer
  }


@app.get("/")
def health():
  return {"status": "ok"}