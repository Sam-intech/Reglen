from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
# ===================================================================


# Load embeddings + index
emb = HuggingFaceEmbeddings(
  model_name="sentence-transformers/all-MiniLM-L6-v2"
)

dbase = FAISS.load_local("data/index", emb, allow_dangerous_deserialization=True)


# ------------------
# User question
question = "What does regulation require for customer due diligence?"


# ------------------
# Retrieve context
docs = dbase.similarity_search(question, k=4)
context = "\n\n".join([d.page_content for d in docs])


# -----------------
# LLM (guarded)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

messages = [
  SystemMessage(
    content=(
      "You are a regulatory analysis assistant. "
      "Answer ONLY using the provided context. "
      "If the answer is not in the context, say: NOT FOUND."
    )
  ),

  HumanMessage(
    content=f"Context:\n{context}\n\nQuestion:\n{question}"
  )
]

response = llm.invoke(messages)

# print("\nANSWER:\n")
# print(response.content)
print(f"\nANSWER:\n{response.content}")
