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

from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
import reddit_tools
from dotenv import load_dotenv

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
        # company_info['background'] = self_ask_with_search.run(f"What is some background information about {company}?\
                                            # Your answer should not contain more than 200 words, and should include general information on {company}.")
        company_info['competitors'] = self_ask_with_search.run(f"What are 10 competitors of {company}?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['social_media_apps'] = self_ask_with_search.run(f"Which Social Media apps does the average customer of {company} use the most?\
                                           Answer as a ranked list with no and's in the format item_1,item_2,...,item_n")
        company_info['industries_and_sectors'] = self_ask_with_search.run(f"What industry and sectors is {company} a part of?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['key_selling_points'] = self_ask_with_search.run(f"What are the key selling points of {company}'s products? Try to generalize and not base it off one product.\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['subreddits'] = self_ask_with_search.run(f"Which Reddit subreddits are most suitable for {company} to post in based on their products?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        company_info['new_releases'] = self_ask_with_search.run(f"What are some new products released by {company} in the last year?\
                                            Answer as a list with no and's in the format item_1,item_2,...,item_n")
        return company_info
        
    # def Reddit_Find_Relevant_Subreddits():


#     def Reddit_Reserach_Subreddit():

#     def Reddit_Find_Relevant_Posts_in_Subreddit():

    def Reddit_Write_Post(self, post_topic, company_info):
        tools = load_tools(["google-serper"], llm=self.llm)
        tools.append(reddit_tools.Subreddit_Search_Relevant_N_Posts())
        tools.append(reddit_tools.Subreddit_Top_N_Posts())
        writing_prompt = PromptTemplate(
            input_variables = ["Subreddit", "N", "Topic", "Company", "Competitors", "Key_Selling_Points"],
            template = "You are a marketing professional for {Company}. Create a promotional post for your company about \"{Topic}\"  to post in the {Subreddit} subreddit.\n\
                Base the style of the post you will write on the style of the titles of the {N} Top posts of all time in that subreddit. Further information to be taken into account when writing your marketing post will be below:\n\n\
                Company Name: {Company}\nCompetitors: {Competitors}\nCompany Key Selling Points: {Key_Selling_Points}\nSearch any aditional context regarding {Topic} and {Topic}s Key Selling Points online using serper or google search."
        )
        prompt_to_writer = writing_prompt.format(Topic=post_topic,
                                                Subreddit="Gaming",
                                                N=10,
                                                Company=company_info['name'],
                                                Competitors=company_info['competitors'],
                                                Key_Selling_Points=company_info['key_selling_points'])
        writer = initialize_agent(tools, self.llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
        return writer.run(prompt_to_writer)


    # def Create_General_Post(self, query, company_info):


