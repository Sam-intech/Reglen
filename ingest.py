import os
from config import DATA_PATH

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
# =================================================================


docs = []

for file in os.listdir(DATA_PATH):
  # path = os.path.join(DATA_PATH, file)

  if file.lower().endswith(".pdf"):
    path = os.path.join(DATA_PATH, file)
    loader = PyPDFLoader(path)
    docs.extend(loader.load())

print(f"Loaded {len(docs)} pages")

# ------------------------------------------------------------------
# breaking long documents into smaller chunks
splitter = RecursiveCharacterTextSplitter(
  chunk_size = 450,
  chunk_overlap = 50,
)

chunks = splitter.split_documents(docs)

print(f"Split into {len(chunks)} chunks")
