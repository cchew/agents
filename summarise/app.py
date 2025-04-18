from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.team import Team
from pydantic import BaseModel

# TODO Store somewhere else
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
    # {
    #     "name": "Work",
    #     "tasks": [
    #         {"task": "Code website redesign"},
    #         {"task": "Prepare for Drupal presentation"},
    #     ],
    # },
    # {
    #     "name": "Restaurants to try",
    #     "tasks": [
    #         {"task": "Wilma"},
    #         {"task": "Such and Such"},
    #     ],
    # },
    {
        "name": "Books to read",
        "tasks": [
            {"task": "Atomic Habits"},
            {"task": "The 4-Hour Workweek"},
            {"task": "The Lean Startup"},
        ],
    },
    # {
    #     "name": "What not to do",
    #     "tasks": [
    #         {"task": "No ArcGIS certification"},
    #         {"task": "No checking emails first and last thing each day"},
    #         {"task": "No learning to procrastinate"},
    #     ],
    # },
    # {
    #     "name": "Pilot project checklist",
    #     "tasks": [
    #         {"task": "How would you reward success?"},
    #         {"task": "What other resources are necessary for success?"},
    #         {"task": "What are achievable datelines"},
    #         {
    #             "task": "What is the right mix of people (knowledge, skills, personal chemistry)?"
    #         },
    #     ],
    # },
]

model = OpenAIChat(id="gpt-4o")
model_mini = OpenAIChat(id="gpt-4o-mini")
summary_instructions = [
    "Always include sources",
    "Use tables to display data",
    "Display charts or images if relevant",
]

# TODO Perhaps make this generic: always do a search when trying to complete a task (or at least compare with results)?
# TODO Improve prompt. Perhaps use description, instructions etc. https://docs.agno.com/agents/introduction

web_agent = Agent(
    name="Web Agent",
    role="Search the web for existing summaries of books.",
    model=model,
    tools=[DuckDuckGoTools(cache_results=True)],
    instructions=summary_instructions,
    show_tool_calls=True,
    markdown=True,
)


class Task(BaseModel):
    list_name: str
    task_name: str


class RelatedTasks(BaseModel):
    tasks: list[Task]


def format_task_lists(task_lists):
    """From GitHub Copilot"""
    formatted_strings = []
    for list_item in task_lists:
        tasks = [f'"{task["task"]}"' for task in list_item["tasks"]]
        formatted_line = f'{list_item["name"]}: {", ".join(tasks)}'
        formatted_strings.append(formatted_line)
    return formatted_strings


# TODO Related tasks for completion agent
task_agent = Agent(
    name="Task Agent",
    # This works!
    role="Find related tasks from the given task list that can be completed as a result of completing the given task.",
    instructions=[
        "Do not create or suggest new tasks.",
        "You can return zero, one or more tasks.",
        "The following is the list of tasks in the structure of 'task list name: task 1, task 2, ...'",
    ]
    + format_task_lists(task_lists),
    # This doesn't work: still creates random tasks.
    # role="Find related tasks from the 'Task lists' context that can be completed as a result of completing the given task.",
    # instructions="""
    # 1. Look only at the tasks provided in the 'Task lists' context
    # 2. Return only existing tasks that are related to the input task
    # 3. Do not create or suggest new tasks
    # 4. Tasks must match exactly as they appear in the lists
    # """,
    # context={
    #     "Task lists": task_lists,
    # },
    # model_mini can't be used here - bad performance.
    model=model,
    show_tool_calls=True,
    markdown=True,
    # No streaming if we use a response model. Tested and works.
    # response_model=RelatedTasks,
)

# task_agent.print_response(
#     "Read 'Atomic Habits'",
#     stream=True,
# )

# TODO Pass other team task context/output to this agent to help make make better decisions.
next_steps_agent = Agent(
    name="Next Steps Agent",
    role="Identify next steps after completing the task.",
    instructions=[
        "You can return zero, one or more tasks.",
        "First, identify any existing tasks that are a natural or logical next step after completing the current task.",
        "Second, suggest new tasks that are a natural or logical next step after completing the current task.",
        "When suggesting new tasks, consider the existing task lists and tasks, and suggest new tasks based on the goal or direction of existing tasks.",
        "When sugggesting new tasks, carefully consider existing task list names. If none are appropriate, then use 'Unassigned'.",
        "The following is the list of existing tasks in the structure of 'task list name: task 1, task 2, ...'",
    ]
    + format_task_lists(task_lists),
    # If not using response model.
    expected_output="""
    Short, concise, and actionable tasks in markdown format.

    {Task list name}
    1. {Bullet point 1 - existing or suggested task name} {new line}
       Rationale: {Rationale for suggesting the task}
    """,
    model=model,
    show_tool_calls=True,
    markdown=True,
)

# next_steps_agent.print_response(
#     "Read 'Atomic Habits'",
#     stream=True,
# )

# TODO Maybe Workflow might be more appropriate here?
agent_team = Team(
    mode="coordinate",
    # TODO 'next_steps_agent' interfering with 'task_agent'
    members=[web_agent, task_agent],
    model=model,
    # TODO "according to user preferences", add user preferences as context
    # Does not work well - does too many web searches and doesn't use the 'task_agent'.
    # success_criteria="""
    #     A comprehensive summary of the book, so that the user can understand it without reading the book.
    #     Output the list of existing tasks that can be completed as a result of the summary.
    #     Output the list of existing or new tasks that are a natural or logical next step after completing the summary.
    # """,
    # instructions=[
    #     "Do not suggest reading the book that is being summarised.",
    #     "For 'task_agent' and 'next_steps_agent', do not change the agent output - directly return to the user.",
    # ],
    # This works, before adding 'next_steps_agent'.
    # success_criteria="""
    # A comprehensive summary of the book, so that the user can understand it without reading the book.
    # Output the list of existing tasks that can be completed as a result of the summary.
    # """,
    # instructions=summary_instructions,
    show_tool_calls=True,
    markdown=True,
)

agent_team.print_response(
    "Read 'Atomic Habits'",
    stream=True,
)
