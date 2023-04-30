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
sNhp = reddit_tools.Subreddit_Hot_N_Posts()
sNtp = reddit_tools.Subreddit_Top_N_Posts()
ssNtpbt = reddit_tools.Subreddit_Search_Top_N_Posts_By_Topic()
llm = OpenAI(temperature=0)
tools = [
    Tool(
        name = "search",
        func=search.run,
        description="useful for when you need to answer questions about current events. You should ask targeted questions"
    ),
    Tool(
        name = "Subreddit N Relevant Posts By Topic",
        func = ssNtpbt,
        description = "Relevant Posts Search: Use this when you need to create something based on a specific topic based on a number of \"n\" relevant posts in a specified subreddit.\
              Should be a comma separated list of a String representing the creation request, String representing the topic, a String representing the subreddit,\
                  and a integer n represeting the number of posts. For example: `body,interesting stuff,test,10` if you are looking to create the text body for a post\
                      based on 10 Top posts on the topic interesting stuff from the test subreddit."
    ),
    Tool(
        name = "Subreddit N HOT Posts",
        func = sNhp,
        description = "Hot Posts Search: Use this when you need to create something based on a number \"n\" current Hottest posts in a specified subreddit.\
              Should be a comma separated list of a String representing the creation request, a String representing the subreddit,\
                  and a integer n represeting the number of posts. For example: `body,test,10` if you are looking to create the text body for a post\
                      based on 10 Hot posts from the test subreddit."
    ),
    Tool(
        name = "Subreddit N TOP Posts",
        func = sNtp,
        description = "Top Posts Search: Use this when you need to get \"n\" number of Top posts of all time in a specified subreddit.\
              Should be a comma separated list of a String representing the creation request, a String representing the subreddit,\
                  and a integer n represeting the number of posts. For example: `body,test,10` if you are looking to create the text body for a post\
                      based on 10 Top posts from the test subreddit."
    ),
]
testprompt_hot = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    template="Create a {Request} for a post in the {Subreddit} subreddit about {Topic} based on the {N} current Hottest posts in that subreddit."
)
testprompt_top = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    template="Create a {Request} for a post in the {Subreddit} subreddit about {Topic} based on the {N} Top posts of all time in that subreddit."
)
testprompt_topic_top = PromptTemplate(
    input_variables=["Request", "Topic", "Subreddit", "N"],
    template="Create a {Request} for a post in the {Subreddit} subreddit about the Topic {Topic}. Base the {Request} on the {N} Relevant posts about that topic and then also {N} Top posts in that subreddit."
    # template="Create a {Request} for a post in the {Subreddit} subreddit about the Topic {Topic} based on the {N} Relevant posts about that topic and also {N} Top posts in that subreddit."
)

prompt_hot = testprompt_hot.format(Request="title", Topic="", Subreddit="", N=50)
prompt_top = testprompt_top.format(Request="title", Topic="", Subreddit="", N=50)
prompt_topic_top = testprompt_topic_top.format(Request="title", Topic="", Subreddit="", N=25)


agent = initialize_agent(tools, llm, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

agent.run(prompt_topic_top)


