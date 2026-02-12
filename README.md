AI Finance RAG System

A Retrieval-Augmented Generation (RAG) system that answers finance-related questions using domain-specific data instead of relying on generic LLM responses.

This project reduces hallucinations by grounding responses in retrieved financial context before generation.

Overview

Large Language Models can generate fluent answers, but without domain context they often produce inaccurate financial information.

This system improves reliability by:

Embedding financial documents into a vector database

Performing semantic search to retrieve relevant context

Injecting retrieved context into a structured prompt

Generating grounded responses using an LLM

The result is context-aware, explainable financial answers.

Architecture

Flow:

User → React Frontend → FastAPI Backend → Embeddings → Vector Database → LLM → Streamed Response

Pipeline:

User submits a query

The query is converted into vector embeddings

The vector database retrieves relevant financial documents

Retrieved context is injected into the prompt

The LLM generates a grounded response

The response streams back to the frontend

Tech Stack

Frontend

React (TypeScript)

TailwindCSS

Backend

FastAPI

Python

OpenAI API

AI Components

Embeddings model

Vector database (Pinecone / FAISS / Chroma)

Semantic retrieval

Prompt engineering

Setup
Clone the repository
git clone <repo-url>
cd <repo-name>
Backend
cd backend
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows


pip install -r requirements.txt

Create a .env file:

OPENAI_API_KEY=your_key_here
VECTOR_DB_KEY=your_key_here

Run the server:

uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000
Frontend
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
Design Goals

Reduce hallucination in financial responses

Improve grounding and explainability

Maintain modular RAG pipeline design

Keep system production-ready and extensible
