import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { Prisma } from "@prisma/client";
import { Button, message } from "antd";

import type { ApiResponse } from 'marku/utils/apiResponses'
import Link from "next/link";


const CampaignPage: NextPage = () => {
  const router = useRouter()
  const { campaignId } = router.query
  const deleteCamapignMutation = api.campaign.deleteCampaign.useMutation();
  const { data: campaignResponse, isLoading: campaignIsLoading, isError: campaignIsError } = api.campaign.getCampaignById.useQuery({ id: campaignId as string }, { enabled: !!campaignId });
  const { data: elementsResponse, isLoading: elementsIsLoading, isError: elementsIsError } = api.element.getElementsForCampaign.useQuery({ campaignId: campaignId as string }, { enabled: !!campaignId })

  const campaignData: Prisma.CampaignGetPayload<null> = campaignResponse?.data

  const handleDeleteCampaign = async () => {
    const res = await deleteCamapignMutation.mutateAsync({ id: campaignId as string }) 
    if (res.status === 'success') {
      message.success('Campaign deleted successfully')
      router.push('/campaigns')
    } else {
      message.error('Error deleting campaign')
    }
  }


  return (
    <Template pageTitle="Campaign">
      <div className="w-full flex justify-end mt-20">
        <Button type="primary" onClick={() => void router.push(`/campaign/${campaignId as string}/element/new`)}>Create a new Element</Button>
        <Button danger onClick={handleDeleteCampaign}>Delete Campaign</Button>
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
                      <Link href={`/campaign/${campaignId as string}/element/${element.id}`} key={element.id}>
                        <div>{element.name}</div>
                        <div>{element.description}</div>
                      </Link>
                    ))}


              </div>
            </div>

          )}
    </Template>
  );
}

export default CampaignPage;
