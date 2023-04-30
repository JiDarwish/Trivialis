import { Button, message } from "antd";
import Loading from "marku/components/layout/Loading";
import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const CampaignListItem = ({ campaign, handleDelete }: { campaign: any, handleDelete: (id: string) => Promise<void>}) => {
  return (
    <div className="flex justify-between">
      <Link href={`/campaign/${campaign.id}`}  className="flex w-full">
        <div className="mr-3">{campaign.name}</div>
        <div>{campaign.description}</div>
      </Link>
      <Button danger onClick={() => handleDelete(campaign.id)}>Delete</Button>
    </div>
  )
}


const CampaignsPage: NextPage = () => {
  const { data, isLoading, isError, refetch } = api.campaign.getMyCampaigns.useQuery()
  const deleteCampaignMutation = api.campaign.deleteCampaign.useMutation()
  const router = useRouter()

  if (isLoading) return <Loading />
  if (isError) return <div>Error</div>

  const handleDelete = async (campaignId: string) => {
    const res = await deleteCampaignMutation.mutateAsync({ id: campaignId })
    if (res.status === 'success') {
      message.success('Campaign deleted successfully')
      refetch()
    } else {
      message.error('Error deleting campaign')
    }
  }



  return (
    <Template pageTitle="Campaigns">
    <div className="w-full flex justify-end mt-10">
      <Button type="primary" onClick={() => void router.push('/campaign/new')}>Create a new Campaign</Button>
    </div>

      <div>Here you see your campaigns: </div>
      <div className="w-1/2">

        {data?.data?.map(campaign => (
          <CampaignListItem key={campaign.id} campaign={campaign} handleDelete={handleDelete} />
        ))}
      </div>
    </Template>
  )
}

export default CampaignsPage;
