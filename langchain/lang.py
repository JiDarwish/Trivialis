import os
import sys
from typing import Any
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains import APIChain
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

class lang_utils():
    
    load_dotenv()
    os.environ["OPENAI_API_KEY"] = os.getenv("OPEN_AI_API_KEY")
    os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")
    search = GoogleSerperAPIWrapper()
    llm = OpenAI(temperature=0)

    def Google_Research_Company(self, query):
        """
        Research comapny through search, 
        have prompt to summarize findings into fields,
        Use those fields into a data structure like a dictionary
        """
        company = query
        tools = [
        Tool(
            name="Intermediate Answer",
            func=self.search.run,
            description="useful for when you need to ask with search"
            )
        ]
        self_ask_with_search = initialize_agent(tools, self.llm, 
                                            agent=AgentType.SELF_ASK_WITH_SEARCH, 
                                            verbose=True)
        competitors = self_ask_with_search.run(f"What are 10 competitors of {company}?\
                                               Answer as a list with no and's in the format item_1,item_2,...,item_n.")
        smapps = self_ask_with_search.run(f"Which Social Media apps are most used by {company} customers?\
                                           Answer as a ranked list with no and's in the format item_1,item_2,...,item_n.")
        print(competitors)
        print(type(competitors))
        print(smapps)
        print(type(smapps))
lu = lang_utils()
lu.Google_Research_Company("Volkswagen")
        
#     def Reddit_Find_Relevant_Subreddits():

#     def Reddit_Reserach_Subreddit():

#     def Reddit_Find_Relevant_Posts_in_Subreddit():

#     def Reddit_Write_Reddit_Post():




