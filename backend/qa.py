from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
# ===================================================================


# Load embeddings + index
emb = HuggingFaceEmbeddings(
  model_name="sentence-transformers/all-MiniLM-L6-v2"
)

dbase = FAISS.load_local(
  "data/index", 
  emb, 
  allow_dangerous_deserialization=True
)


# ------------------
# User question
question = "What does regulation require for customer due diligence?"
# question = "what does regulation 7 require firms to do?"


# ------------------
# Retrieve context
docs = dbase.similarity_search(question, k=4)
context = "\n\n".join([d.page_content for d in docs])
sources = [
  f"Source {i+1}: {d.metadata['source']} (chunk {d.metadata['chunk']})"
  for i, d in enumerate(docs)
]

if not docs:
  print("ANSWER:\nNOT FOUND")
  exit()

# removing duplicates (same source + chunk) from sources list
seen = set()
sources = []

for i, d in enumerate(docs):
  key = (d.metadata.get("source"), d.metadata.get("chunk"))
  if key not in seen:
    seen.add(key)
    sources.append(
      f"Source {len(sources)+1}: {key[0]} (chunk {key[1]})"
    )



# -----------------
# LLM (guarded)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

messages = [
  SystemMessage(
    content=(
      "You are a regulatory analysis assistant. "
      "Answer ONLY using the provided context. "
      "Cite sources inline like [source 1]. "
      "If the answer is not in the context, say: NOT FOUND."
    )
  ),

  HumanMessage(
    content=f"Context:\n{context}\n\nQuestion:\n{question}"
  )
]

response = llm.invoke(messages)


# ---------------
# final output
# print("\nANSWER:\n")
# print(response.content)
print(f"\nANSWER:\n{response.content}")
print("\nSOURCES:\n")
for s in sources:
  print("-", s)



# ============================
SYSTEM_PROMPT = messages[0].content

def run_qa(question: str):
  docs = dbase.similarity_search(question, k=4)
  context = "\n\n".join([d.page_content for d in docs])

  response = llm.invoke([
    SystemMessage(content=SYSTEM_PROMPT),
    HumanMessage(content=f"Context:\n{context}\n\nQuestion:\n{question}")
  ])

  seen = set()
  sources = []
  for d in docs:
    key = (d.metadata.get("source"), d.metadata.get("chunk"))
    if key not in seen:
      seen.add(key)
      sources.append({
        "source": key[0],
        "chunk": key[1]
      })

  return response.content, sources
