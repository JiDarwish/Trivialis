import { Campaign } from "@prisma/client";
import { Button, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import ThreeCards from "marku/components/generic/ThreeCards";
import Loading from "marku/components/layout/Loading";
import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const CampaignListItem = ({ campaign, handleDelete }: { campaign: Campaign, handleDelete: (id: string) => Promise<void> }) => {
  return (
    <div className="flex justify-between">
      <Link href={`/campaign/${campaign.id}`} className="flex w-full">
        <div className="mr-3">{campaign.name}</div>
        <div>{campaign.description}</div>
      </Link>
      <Button danger onClick={() => void handleDelete(campaign.id)}>Delete</Button>
    </div>
  )
}

interface DataType {
  key: number;
  campaignTitle: string;
  description: string;
  results: string;
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
      void message.success('Campaign deleted successfully')
      void refetch()
    } else {
      void message.error('Error deleting campaign')
    }
  }

  const results = ['success', 'success', 'success', 'success', 'fail', 'neutral'];

  const tableData = data.data?.map((campaign, index) => ({
    key: campaign.id, // Add a unique key for each row
    campaignTitle: campaign.name,
    description: campaign.description,
    goals: campaign.goal,
  }));

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'campaignTitle',
      key: 'campaignTitle',
      render: (text: string, record: DataType) => (
        <Link href={`/campaign/${record.key}`}>{text}</Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Goal',
      dataIndex: 'goals',
      key: 'c=goals',
    },

  ];


  return (
    <Template pageTitle="Campaigns" >
      <div className="w-full flex justify-end mt-10">
        <Button type="primary" onClick={() => void router.push('/campaign/new')}>Create a new Campaign</Button>
      </div>

      <div className="w-full text-left text-xl font-medium mb-10">Next scheduled campaigns</div>
      <ThreeCards />

      <div className="w-full text-left text-xl font-medium mt-20 mb-8">Past Campaigns </div>
      <Table className="w-full" columns={columns} dataSource={tableData} />
    </Template >
  )
}

export default CampaignsPage;
