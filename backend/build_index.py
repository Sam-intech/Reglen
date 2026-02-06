from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from ingest import chunks
# ===================================================================

emb = HuggingFaceEmbeddings(
  model_name="sentence-transformers/all-MiniLM-L6-v2"
)

dbase = FAISS.from_documents(chunks, emb)
dbase.save_local("data/index")

print("Vector index built successfully!")
