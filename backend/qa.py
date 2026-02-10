from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
# ===================================================================


# Load embeddings + index
emb = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
dbase = FAISS.load_local("data/index", emb, allow_dangerous_deserialization=True)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)  

SYSTEM_PROMPT = (
  "You are a regulatory analysis assistant. "
  "Answer ONLY using the provided context.  "
  # "Cite sources inline like [source 1]. "
  # "when stating facts, cite the source inline in square brackets "
  # "(e.g. [FCG, Page 12]). "
  "If the context implies an answer, summarise it clearly. "
  "If the answer truly cannot be inferred, say: NOT FOUND."
)

# --------------
# Core function
def run_qa(question: str):
  docs = dbase.similarity_search(question, k=8)

  if not docs:
    return "NOT FOUND"
  
  context = "\n\n".join([d.page_content for d in docs])

  response = llm.invoke([
    SystemMessage(content=SYSTEM_PROMPT),
    HumanMessage(
      content=(
        f"Context:\n{context}\n\n"
        f"Question:\n{question}\n\n"
        # "Cite sources inline where relevant."
      )
    )
  ])


  return response.content

