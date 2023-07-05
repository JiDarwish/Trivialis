import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { Prisma } from "@prisma/client";
import { Button, message } from "antd";
import Link from "next/link";

const ElementItem = ({ campaignId, element, handleDelete }: { campaignId: string, handleDelete: (elementId: string) => Promise<void>, element: Prisma.ElementGetPayload<null> }) => {
  return (
    <div className="flex justify-between w-full">
      <Link href={`/campaign/${campaignId}/element/${element.id}`} key={element.id}>
        <div>{element.name}</div>
        <div>{element.description}</div>
      </Link>
      <Button danger onClick={() => void handleDelete(element.id)}>Delete</Button>
    </div>

  )
}

const CampaignPage: NextPage = () => {
  const router = useRouter()
  const { campaignId } = router.query
  const deleteCamapignMutation = api.campaign.deleteCampaign.useMutation();
  const deleteElementMutation = api.element.deleteElement.useMutation();
  const { data: campaignResponse, isLoading: campaignIsLoading, isError: campaignIsError } = api.campaign.getCampaignById.useQuery({ id: campaignId as string }, { enabled: !!campaignId });
  const { data: elementsResponse, isLoading: elementsIsLoading, isError: elementsIsError, refetch } = api.element.getElementsForCampaign.useQuery({ campaignId: campaignId as string }, { enabled: !!campaignId })

  const campaignData: Prisma.CampaignGetPayload<null> = campaignResponse?.data as Prisma.CampaignGetPayload<null>

  const handleDeleteCampaign = async () => {
    const res = await deleteCamapignMutation.mutateAsync({ id: campaignId as string })
    if (res.status === 'success') {
      void message.success('Campaign deleted successfully')
      void router.push('/campaigns')
    } else {
      void message.error('Error deleting campaign')
    }
  }

  const handleDeleteElement = async (elementId: string) => {
    const res = await deleteElementMutation.mutateAsync({ elementId: elementId })
    if (res.status === 'success') {
      void message.success('Element deleted successfully')
      void refetch()
    } else {
      void message.error('Error deleting element')
    }
  }


  return (
    <Template pageTitle="Campaign">
      <div className="w-full flex justify-end mt-20">
        <Button type="primary" onClick={() => void router.push(`/campaign/${campaignId as string}/element/new`)}>Create a new Element</Button>
        <Button danger onClick={void handleDeleteCampaign}>Delete Campaign</Button>
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
                        <ElementItem key={element.id} handleDelete={handleDeleteElement} campaignId={campaignId as string} element={element} />
                      ))}
              </div>
            </div>

          )}
    </Template>
  );
}

export default CampaignPage;
