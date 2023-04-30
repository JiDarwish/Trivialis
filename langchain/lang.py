import os
import sys
from typing import Any
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
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

chat = ChatOpenAI(temperature=0)
llm = OpenAI(temperature=0)
search = GoogleSerperAPIWrapper()
tools = load_tools(["google-serper"], llm=llm)
tools.append(reddit_tools.Subreddit_Hot_N_Posts())
tools.append(reddit_tools.Subreddit_Top_N_Posts())
tools.append(reddit_tools.Subreddit_Search_Relevant_N_Posts())
testprompt_hot = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    template="Create a {Request} for a post in the {Subreddit} subreddit about {Topic} based on the {N} current Hottest posts in that subreddit."
)
testprompt_top = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    template="Create a {Request} for a post in the {Subreddit} subreddit about {Topic} based on the {N} Top posts of all time in that subreddit."
)
testprompt_topic = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    # template="Create a {Request} for a post in the {Subreddit} subreddit about the Topic {Topic}. Base the {Request} on the {N} Relevant posts about that topic and then also {N} Top posts in that subreddit."
    template="Create a {Request} for a post in the {Subreddit} subreddit about the Topic {Topic} based on the {N} Relevant posts about that topic in that subreddit."
)

prompt_hot = testprompt_hot.format(Request="title", Topic="", Subreddit="", N=50)
prompt_top = testprompt_top.format(Request="title", Topic="", Subreddit="", N=50)
prompt_topic = testprompt_topic.format(Request="body", Topic="Why PC is better than console", Subreddit="Gaming", N=1)


agent = initialize_agent(tools, chat, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

agent.run(prompt_topic)


