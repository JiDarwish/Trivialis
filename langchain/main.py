from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from lang import lang_utils

app = FastAPI()

lu = lang_utils()
# lu = lang_utils()
# lu.Reddit_Write_Post("Ubisoft's newest game and what makes it super amazing!", lu.Google_Research_Company("Ubisoft"))
# lu.Google_Research_Company("Ubisoft")

# API route for Google_Research_Company
class CompanyInfo(BaseModel):
    name: str
    websiteLink: str
    description: Optional[str] = None
    toneAndVoice: Optional[str] = None
    preferredTargetAudiance: Optional[str] = None
    socialMediaLinks: Optional[str] = None

class CompanyResearchInfo(BaseModel):
    competitors: str
    socialMediaApps: str
    industriesAndSectors: str
    keySellingPoints: str
    subreddits: str
    newReleases: str

class Post(BaseModel):
    postTopic: str
    company: CompanyInfo

@app.post("/lang-api/company")
async def research_company(company: CompanyInfo):
    return lu.Google_Research_Company(company.name)

@app.post("/lang-api/post")
async def write_post(post: Post):
    return lu.Reddit_Write_Post(post.postTopic, lu.Google_Research_Company(post.company.name))


# function that tests api route
def test_write_post():
    company = CompanyInfo(name="Ubisoft", websiteLink="https://www.ubisoft.com/en-us/", description="Ubisoft Entertainment SA is a French video game company headquartered in Montreuil with several development studios across the world. It publishes games for several video game franchises, including Rayman, Raving Rabbids, Prince of Persia, Assassin's Creed, Far Cry, Just Dance, and Tom Clancy.", toneAndVoice="Professional", preferredTargetAudiance="Gamers", socialMediaLinks="https://www.facebook.com/ubisoft.usa/, https://twitter.com/ubisoft, https://www.instagram.com/ubisoft/")
    post = Post(postTopic="Ubisoft's newest game and what makes it super amazing!", company=company)

    # call api route with requests library
    import requests
    r = requests.post("http://0.0.0.0:9000/lang-api/post", json=post.dict())
    print(r._content)

def test_research_company():
    company = CompanyInfo(name="Ubisoft", websiteLink="https://www.ubisoft.com/en-us/", description="Ubisoft Entertainment SA is a French video game company headquartered in Montreuil with several development studios across the world. It publishes games for several video game franchises, including Rayman, Raving Rabbids, Prince of Persia, Assassin's Creed, Far Cry, Just Dance, and Tom Clancy.", toneAndVoice="Professional", preferredTargetAudiance="Gamers", socialMediaLinks="https://www.facebook.com/ubisoft.usa/, https://twitter.com/ubisoft, https://www.instagram.com/ubisoft/")

    # call api route with requests library
    import requests
    r = requests.post("http://0.0.0.0:9000/lang-api/company", json=company.dict())
    print(r._content)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=9000)
