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
import templates

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPEN_AI_API_KEY")
os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")

search = GoogleSerperAPIWrapper()
sh10p = reddit_tools.Subreddit_Hot10Posts_Full()
shnp = reddit_tools.Subreddit_Hot_N_Posts()
llm = OpenAI(temperature=0)
tools = [
    Tool(
        name = "search",
        func=search.run,
        description="useful for when you need to answer questions about current events. You should ask targeted questions"
    ),
    Tool(
        name = "Subreddit Top N Posts",
        func = shnp,
        description = "Use this when you need to search for a number \"n\"  Hot posts in a specified subreddit.\
              Should be a comma separated list of a String representing the subreddit and a integer n represeting\
                the number of posts. For example: `test,10` if you are looking for 10 posts from the test subreddit."
    )
]
testprompt = PromptTemplate(
    input_variables=["Subreddit", "N"],
    template="Create a post for the {Subreddit} subreddit based on the {N} hot posts in that subreddit."
)
# testprompt = PromptTemplate(
#     input_variables=["Subreddit"],
#     template="Create a post for the {Subreddit} subreddit based on the 10 current hot posts in that subreddit."
# )

prompt = testprompt.format(Subreddit="NonCredibleDefense", N=20)


agent = initialize_agent(tools, llm, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
agent.run(prompt)