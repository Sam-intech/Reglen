from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
# ==================================================================


emb = HuggingFaceEmbeddings(
  model_name="sentence-transformers/all-MiniLM-L6-v2"
)
dbase = FAISS.load_local("data/index", emb, allow_dangerous_deserialization=True)
query = "What does the regulation say about customer due diligence?"
results = dbase.similarity_search(query, k=3)

for i, doc in enumerate(results, 1):
  print(f"\n--- Result {i} ---")
  print(doc.page_content[:500])
