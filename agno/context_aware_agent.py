# Read tasks/lists as context (or knowledge?), e.g. checklist, do/do not do lists, try/experiments, agenda
task_lists = [
    {
        "name": "Unassigned",
        "tasks": [
            {"task": "Write a blog post about Agno"},
            {"task": "Go grocery shopping"},
            {"task": "Call mom"},
            {"task": "Read Atomic Habits"},
        ],
    },
    {
        "name": "Work",
        "tasks": [
            {"task": "Code website redesign"},
            {"task": "Prepare for Drupal presentation"},
        ],
    },
    {
        "name": "Restaurants to try",
        "tasks": [
            {"task": "Wilma"},
            {"task": "Such and Such"},
        ],
    },
    {
        "name": "Books to read",
        "tasks": [
            {"task": "Atomic Habits"},
            {"task": "The 4-Hour Workweek"},
            {"task": "The Lean Startup"},
        ],
    },
    {
        "name": "What not to do",
        "tasks": [
            {"task": "No ArcGIS certification"},
            {"task": "No checking emails first and last thing each day"},
            {"task": "No learning to procrastinate"},
        ],
    },
    {
        "name": "Pilot project checklist",
        "tasks": [
            {"task": "How would you reward success?"},
            {"task": "What other resources are necessary for success?"},
            {"task": "What are achievable datelines"},
            {
                "task": "What is the right mix of people (knowledge, skills, personal chemistry)?"
            },
        ],
    },
]

# TODO Allow user to override prompts
# TODO Externalise prompts
# TODO Cache tool call results
# TODO Save results (done with memory) and WIP (this one a bit harder?)

from agno.agent.agent import Agent
from agno.memory.v2.db.sqlite import SqliteMemoryDb
from agno.memory.v2.memory import Memory
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from rich.pretty import pprint

memory_db = SqliteMemoryDb(table_name="memory", db_file="tmp/memory.db")
memory = Memory(db=memory_db)
memory.clear()

session_id = "session_1"
john_doe_id = "john_doe@example.com"

agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    memory=memory,
    storage=SqliteStorage(
        table_name="agent_sessions", db_file="tmp/persistent_memory.db"
    ),
    enable_user_memories=True,
)

# Learn over time, remember preferences (use Agno agentic)
agent.print_response(
    "My name is John Doe and I like to hike in the mountains on weekends.",
    stream=True,
    user_id=john_doe_id,
    session_id=session_id,
)

# -*- Print the chat history
# session_run = memory.runs[session_id][-1]
# pprint(session_run)

# memories = memory.get_user_memories(user_id=john_doe_id)
# print("John Doe's memories:")
# pprint(memories)

# agent.print_response(
#     "Ok i dont like hiking anymore, i like to play soccer instead.",
#     stream=True,
#     user_id=john_doe_id,
#     session_id=session_id,
# )

# -*- Print the chat history
# session_run = memory.runs[session_id][-1]
# pprint(session_run)

# From https://github.com/agno-agi/agno/blob/main/cookbook/agent_concepts/memory/03_memory_creation.py
# memory.create_user_memories(
#     message="""\
# I enjoy hiking in the mountains on weekends,
# reading science fiction novels before bed,
# cooking new recipes from different cultures,
# playing chess with friends,
# and attending live music concerts whenever possible.
# Photography has become a recent passion of mine, especially capturing landscapes and street scenes.
# I also like to meditate in the mornings and practice yoga to stay centered.
# """,
#     user_id=john_doe_id,
# )

# memories = memory.get_user_memories(user_id=john_doe_id)
# print("John Doe's memories:")
# pprint(memories)

# agent.print_response(
#     "What are my hobbies?", stream=True, user_id=john_doe_id, session_id=session_id
# )

def format_task_lists(task_lists):
    """From GitHub Copilot"""
    formatted_strings = []
    for list_item in task_lists:
        tasks = [f'"{task["task"]}"' for task in list_item["tasks"]]
        formatted_line = f'{list_item["name"]}: {", ".join(tasks)}'
        formatted_strings.append(formatted_line)
    return "\n".join(formatted_strings)

# memory.create_user_memories(
#     message=format_task_lists(task_lists),
#     user_id=john_doe_id,
# )

# Not great, but better than nothing (it did pick up Wilma and Such and Such)
# agent.print_response(
#     "I want to complete task 'Catchup with Sean' who likes food, what can I suggest to do?", stream=True, user_id=john_doe_id, session_id=session_id
# )