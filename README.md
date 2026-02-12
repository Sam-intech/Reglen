# AI Finance RAG System

A Retrieval-Augmented Generation (RAG) system that answers finance-related questions using domain-specific data instead of relying on generic LLM responses. This project reduces hallucinations by grounding responses in retrieved financial context before generation.



# Overview
Large Language Models can generate fluent answers, but without domain context they often produce inaccurate financial information.

This system improves reliability by:
- Embedding financial documents into a vector database
- Performing semantic search to retrieve relevant context
- Injecting retrieved context into a structured prompt
- Generating grounded responses using an LLM

The result is context-aware, explainable financial answers.



# Architecture

Flow:

User → React Frontend → FastAPI Backend → Embeddings → Vector Database → LLM → Streamed Response

Pipeline:

1. User submits a query
2. The query is converted into vector embeddings
3. The vector database retrieves relevant financial documents
4. Retrieved context is injected into the prompt
5. The LLM generates a grounded response
6. The response streams back to the frontend


# Tech Stack

### Frontend:
- React (TypeScript)
- TailwindCSS

### Backend:
- FastAPI
- Python
- OpenAI API

### AI Components:
- Embeddings model
- Vector database (FAISS)
- Semantic retrieval
- Prompt engineering


# Design Goals
- Reduce hallucination in financial responses
- Improve grounding and explainability
- Maintain modular RAG pipeline design
- Keep system production-ready and extensible
