import os
from config import DATA_PATH

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
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
  chunk_size = 400,
  chunk_overlap = 100,
)

# chunks = splitter.split_documents(docs)
chunks = []

for doc in docs:
  splits = splitter.split_text(doc.page_content)
  for i, text in enumerate(splits):
    chunks.append(
      Document(
        page_content = text,
        metadata = {
          "source": doc.metadata.get("source", "unknown"),
          "page": doc.metadata.get("page"),
          "chunk": i,
        }
      )
    )

print(f"Split into {len(chunks)} chunks")
