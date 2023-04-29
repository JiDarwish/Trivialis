from langchain import PromptTemplate

template1 = """"Using the company name, {CompanyName}, and relevant details provided below, 
please research the market and analyze previous campaigns to develop a comprehensive and innovative marketing campaign strategy. 
Consider the company's target audience, unique selling points, and industry trends in order to make informed suggestions for maximizing impact and achieving marketing goals.
Provide a detailed campaign plan including objectives, target channels, content ideas, and a timeline for implementation."

Company Details:

Company Name: {CompanyName}
Industry: {Industry}
Target Audience: {TargetAudience}
Unique Selling Points:{UniqueSellingPoints}
Previous Campaigns: {PreviousCampaigns}
Marketing Goals: {MarketingGoals}"""


initial_template = PromptTemplate(
    input_variables =["CompanyName", "Industry", "TargetAudience", "UniqueSellingPoints", "PreviousCampaigns", "MarketingGoals"],
    template = template1,
    )

#print(initial_template.format(CompanyName ="Apple", Industry= "Technology", TargetAudience="Tech Enthusiasts",UniqueSellingPoints="High Quality Products", PreviousCampaigns= "iPhone 12", MarketingGoals= "Increase sales by 10%"))