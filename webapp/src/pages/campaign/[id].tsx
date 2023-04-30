import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { Prisma } from "@prisma/client";
import { Button } from "antd";


const CampaignPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: campaignResponse, isLoading: campaignIsLoading, isError: campaignIsError } = api.campaign.getCampaignById.useQuery({ id: id as string }, { enabled: !!id });
  const { data: elementsResponse, isLoading: elementsIsLoading, isError: elementsIsError } = api.element.getElementsForCampaign.useQuery({ campaignId: id as string }, { enabled: !!id })

  const campaignData : Prisma.CampaignGetPayload<null> = campaignResponse?.data


  return (
    <Template pageTitle="Campaign">
      <div className="w-full flex justify-end mt-20">
        <Button type="primary" onClick={() => void router.push(`/campaign/${id as string}/element/new`)}>Create a new Element</Button>
      </div>
      {campaignIsLoading ? <div>Loading...</div>
        : campaignIsError ? <div>Error</div>
          : campaignResponse && (

            <div className="mt-10 flex justify-around w-full">
              <div className="">
                <div className="text-xl">Campaign: {campaignData.name}</div>
                <div>Goal: {campaignData.goal}</div>
                <div className="text-sm">{campaignData.description}</div>
              </div>
              <div>
                Elements:
                {elementsIsLoading ? <div>Loading...</div> 
                : elementsIsError ? <div>Error</div>
                : elementsResponse && elementsResponse.data?.map((element: Prisma.ElementGetPayload<null>) => (
                  <div key={element.id}>
                    <div>{element.name}</div>
                    <div>{element.description}</div>
                    </div>
                ))}


              </div>
            </div>

          )}
    </Template>
  );
}

export default CampaignPage;
