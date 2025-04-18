# From Agno Cookbook

from agno.agent import Agent
from agno.embedder.openai import OpenAIEmbedder
from agno.knowledge.pdf import PDFKnowledgeBase, PDFReader
from agno.vectordb.lancedb import LanceDb

# Initialise LanceDB
vector_db = LanceDb(
    table_name="documents",
    uri="tmp/lancedb",
    embedder=OpenAIEmbedder(id="text-embedding-3-small"),
)

# Create knowledge base
knowledge_base = PDFKnowledgeBase(
    path="data",
    vector_db=vector_db,
    reader=PDFReader(chunk=True),
)

# Comment after first use
knowledge_base.load(recreate=False)

# Create and use the agent
agent = Agent(
    knowledge=knowledge_base,
    show_tool_calls=True,
    debug_mode=True,
)

# TODO Externalise and optimise prompt (see tabs)
# TODO How to evaluate (see tab re: Microsoft "Evaluation metrics")
agent.print_response(
    "Summarise the documents in the knowledge base.",
    markdown=True,
)
