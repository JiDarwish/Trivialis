from langchain.agents import Tool
from langchain.tools import BaseTool
import praw
import os
from dotenv import load_dotenv
load_dotenv()

class Subreddit_Hot10Posts_Titles(BaseTool):
    name = "Reddit_Search"
    description = " "
        
    '''
    Any intialization that needs to be done such as auth
    '''
    reddit = praw.Reddit(
        client_id = os.getenv("REDDIT_CLIENT_ID"),
        client_secret = os.getenv("REDDIT_API_KEY"),
        user_agent = os.getenv("REDDIT_API_USER_AGENT"),
    )

    '''
    Retrieves Titles for 10 "Hot" posts in queried subreddit
    '''
    def _run(self, query: str) -> str:
        sub_titles = []
        subreddit = self.reddit.subreddit(query)
        for submission in subreddit.hot(limit=10):
             sub_titles.append(submission.title)
        return " ".join(sub_titles)
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("SubredditSearchHot10 does not support async")
    

class Subreddit_Hot10Posts_Body(BaseTool):
    name = "Reddit_Search"
    description = " "
        
    '''
    Any intialization that needs to be done such as auth
    '''
    reddit = praw.Reddit(
        client_id = os.getenv("REDDIT_CLIENT_ID"),
        client_secret = os.getenv("REDDIT_API_KEY"),
        user_agent = os.getenv("REDDIT_API_USER_AGENT"),
    )

    '''
    Retrieves Titles for 10 "Hot" posts in queried subreddit
    '''
    def _run(self, query: str) -> str:
        sub_text = []
        subreddit = self.reddit.subreddit(query)
        for submission in subreddit.hot(limit=10):
            if submission.selftext != '':
                sub_text.append(submission.selftext)
            else:
                sub_text.append(submission.url)

        return " ".join(sub_text)
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("SubredditSearchHot10 does not support async")

class Subreddit_Hot10Posts_Full(BaseTool):
    name = "Reddit_Search"
    description = " "
        
    '''
    Any intialization that needs to be done such as auth
    '''
    reddit = praw.Reddit(
        client_id = os.getenv("REDDIT_CLIENT_ID"),
        client_secret = os.getenv("REDDIT_API_KEY"),
        user_agent = os.getenv("REDDIT_API_USER_AGENT"),
    )

    '''
    Retrieves Titles for 10 "Hot" posts in queried subreddit
    '''
    def _run(self, query: str) -> str:
        subm = []
        subreddit = self.reddit.subreddit(query)
        for submission in subreddit.hot(limit=10):
            if submission.selftext != '':
                post = "Post Title: " + submission.title+\
                      " Post Body: " + submission.selftext
                subm.append(post)
            else:
                post = "Post Title: " + submission.title+\
                      " Post Body: " + submission.url
                subm.append(post)

        return " ".join(subm)
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("SubredditSearchHot10 does not support async")

    
class RedditPostTool(BaseTool):
    name = "Reddit_Post"
    description = ""
    '''
    Any intialization that needs to be done such as auth
    '''
    reddit = praw.Reddit(
        client_id = os.getenv("REDDIT_CLIENT_ID"),
        client_secret = os.getenv("REDDIT_API_KEY"),
        user_agent = os.getenv("REDDIT_API_USER_AGENT"),
        username = os.getenv("REDDIT_API_ACC_USERNAME"),
        password = os.getenv("REDDIT_API_ACC_PASSWORD"),
    )

    '''
    Runs the custom tool
    '''
    def _run(self, query: str) -> str:

        return
    
         

