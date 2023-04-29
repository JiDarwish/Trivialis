import os
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
import custom_tools
from dotenv import load_dotenv

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
    ),
    WriteFileTool(),
    ReadFileTool(),
]

agent = initialize_agent(tools, llm, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
agent.run("Who is Vito Vekic?")