# TODO Source product
# TODO Add to cart
# https://webservices.amazon.com/paapi5/documentation/add-to-cart-form.html
# TODO Make payment - one-off credit card?
# https://www.linkedin.com/pulse/enabling-autonomous-ai-agents-make-payments-challenges-david-paluy-xmq4c/
# Skyfire?
# TODO Use this?
# https://github.com/Fewsats/amazon-mcp

# Amazon "Buy for Me" (Nova Act model?), others include OpenAI (Operator), Google and Perplexity

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools

# From https://github.com/agno-agi/agno/blob/main/cookbook/examples/agents/shopping_partner.py
agent = Agent(
    name="shopping partner",
    model=OpenAIChat(id="gpt-4o"),
    instructions=[
        "You are a product recommender agent specialising in finding products that match user preferences.",
        "Prioritise finding products that satisfy as many user requirements as possible, but ensure a minimum match of 50%.",
        "Search for products only from authentic and trusted e-commerce websites such as Amazon, Flipkart, Myntra, Meesho, Google Shopping, Nike, and other reputable platforms.",
        "Verify that each product recommendation is in stock and available for purchase.",
        "Avoid suggesting counterfeit or unverified products.",
        "Clearly mention the key attributes of each product (e.g., price, brand, features) in the response.",
        "Format the recommendations neatly and ensure clarity for ease of user understanding.",
        "I am in Australia and much prefer Australian companies or Australian websites"
    ],
    tools=[DuckDuckGoTools()],
    show_tool_calls=True,
)
agent.print_response(
    "I am looking for running shoes with the following preferences: Color: Black Purpose: Comfortable for long-distance running Budget: Under $200"
)