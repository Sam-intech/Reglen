from ingest import chunks
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
# ===============================================================

emb = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

dbase = FAISS.from_documents(chunks, emb)
dbase.save_local("data/index")

print("Vector index built and saved")
