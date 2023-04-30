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
        company_info = {}
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
        company_info['name'] = company
        company_info['background'] = self_ask_with_search.run(f"What is some background information about {company}?\
                                            Your answer should not contain more than 200 words, and should include general information on {company}.")
        company_info['competitors'] = self_ask_with_search.run(f"What are 10 competitors of {company}?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['social_media_apps'] = self_ask_with_search.run(f"Which Social Media apps are most used by {company} customers?\
                                           Answer as a ranked list with no and's in the format item_1,item_2,...,item_n")
        company_info['industries_and_sectors'] = self_ask_with_search.run(f"What industry and sectors is {company} in?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['key_selling_points'] = self_ask_with_search.run(f"What are the key selling points of {company}'s products?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['subreddits'] = self_ask_with_search.run(f"Which subreddits are most suitable for {company}?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['new_releases'] = self_ask_with_search.run(f"What are some new products released by {company} they may be promoting?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        return company_info
        
    # def Reddit_Find_Relevant_Subreddits():


#     def Reddit_Reserach_Subreddit():

#     def Reddit_Find_Relevant_Posts_in_Subreddit():

    def Reddit_Write_Post(self, query, company_info):
        tools = load_tools(["google-serper"], llm=self.llm)
        tools.append(reddit_tools.Subreddit_Search_Relevant_N_Posts())
        writing_prompt = PromptTemplate(
        input_variables = ["Request", "Subreddit", "N", "Topic", "Company", "Competitors", "Key_Selling_Points", "New_Releases"],
        template = "You are a marketing professional. Create a {Request} for a promotional post in the {Subreddit} subreddit about the Topic {Topic} for the company {Company}.\n\
            The {Request} should be in the the style of the subreddit based on the {N} most Relevant posts about that topic in that subreddit. Futher information to be taken into account when writing your marketing post will be below:\n\n\
            Company Name: {Company}\nCompetitors: {Competitors}\nKey Selling Points: {Key_Selling_Points}\nNew Products Releases: {New_Releases}\n"
        )
        to_writer = writing_prompt.format(Request="body", Topic="Why PC is better than console", Subreddit="Gaming", N=1)
        writer = initialize_agent(tools, self.llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)



    # def Create_General_Post(self, query, company_info):



lu = lang_utils()
lu.Google_Research_Company("Volkswagen")


