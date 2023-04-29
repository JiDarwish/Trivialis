from langchain.agents import Tool
from langchain.tools import BaseTool
import praw
import os
from dotenv import load_dotenv
load_dotenv()

class RedditSearchTool(BaseTool):
    name = "Reddit_Search"
    description = ""
    '''
    Runs the custom tool
    '''
    def _run(self, query: str) -> str:

        return
    
    '''
    Any intialization that needs to be done such as auth
    '''
    def __init__(self) -> None:
        self.reddit = praw.Reddit(
            client_id = os.getenv("REDDIT_CLIENT_ID"),
            client_secret = os.getenv("REDDIT_API_KEY"),
            user_agent = os.getenv("REDDIT_API_USER_AGENT"),
        )
    
class RedditPostTool(BaseTool):
    name = "Reddit_Post"
    description = ""
    '''
    Runs the custom tool
    '''
    def _run(self, query: str) -> str:

        return
    
    '''
    Any intialization that needs to be done such as auth
    '''
    def __init__(self) -> None:
            self.reddit = praw.Reddit(
            client_id = os.getenv("REDDIT_CLIENT_ID"),
            client_secret = os.getenv("REDDIT_API_KEY"),
            user_agent = os.getenv("REDDIT_API_USER_AGENT"),
            username = os.getenv("REDDIT_API_ACC_USERNAME"),
            password = os.getenv("REDDIT_API_ACC_PASSWORD"),
        )
         

