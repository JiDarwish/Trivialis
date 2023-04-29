import os
import sys
from typing import Any
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.utilities import GoogleSerperAPIWrapper
from langchain.agents import Tool
from langchain.tools import BaseTool
from langchain.tools.file_management.write import WriteFileTool
from langchain.tools.file_management.read import ReadFileTool

from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
import praw
import reddit_tools
from dotenv import load_dotenv
sys.path.insert(1, "./langchain/langchain_templates/")
import initial_template

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPEN_AI_API_KEY")
os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")

search = GoogleSerperAPIWrapper()
llm = OpenAI(temperature=0)
tools = [
    Tool(
        name = "search",
        func=search.run,
        description="useful for when you need to answer questions about current events. You should ask targeted questions"
    )
]
# prompt = PromptTemplate(
#     input_variables=["Apple", "Industry", "TargetAudience", "UniqueSellingPoints", "PreviousCampaigns", "MarketingGoals"],
#     template=initial_template.template1
# )

prompt = initial_template.initial_template.format(CompanyName ="Apple", Industry= "Technology", TargetAudience="Tech Enthusiasts",UniqueSellingPoints="High Quality Products", PreviousCampaigns= "iPhone 12", MarketingGoals= "Increase sales by 10%")


# agent = initialize_agent(tools, llm, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
# agent.run(prompt)

test = reddit_tools.Subreddit_Hot10Posts_Full()
print(test._run("NonCredibleDefense"))