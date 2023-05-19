import type { Campaign } from "@prisma/client";
import { Button, Table } from "antd";
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
  key: string;
  campaignTitle: string;
  description: string | null;
  goals: string | null;
}

const CampaignsPage: NextPage = () => {
  const { data: campaignData, isLoading: campaignIsLoading, isError: campaignIsError } = api.campaign.getMyCampaigns.useQuery()
  // const deleteCampaignMutation = api.campaign.deleteCampaign.useMutation()
  const { data: companyData, isLoading: companyIsLoading, isError: companyIsError } = api.company.getMyCompany.useQuery()
  const router = useRouter()

  if (campaignIsLoading || companyIsLoading) return <Loading />
  if (campaignIsError || companyIsError) return <div>Error</div>

  // const handleDelete = async (campaignId: string) => {
  //   const res = await deleteCampaignMutation.mutateAsync({ id: campaignId })
  //   if (res.status === 'success') {
  //     void message.success('Campaign deleted successfully')
  //     void refetch()
  //   } else {
  //     void message.error('Error deleting campaign')
  //   }
  // }

  const tableData = campaignData.data?.map((campaign, _) => ({
    key: campaign.id, // Add a unique key for each row
    campaignTitle: campaign.name,
    description: campaign.description,
    goals: campaign.goal,
    marketingMetrics: 'Click to view',
  }));

  const columns = [
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
      key: 'goals',
    },
    {
      title: 'Marketing Metrics',
      dataIndex: 'marketingMetrics',
      key: 'marketingMetrics',
      render: (text: string, record: DataType) => (
        <Link href={`/campaign/${record.key}`}>Click to view</Link>
      ),
    },
  ];

  console.log("Company", companyData)
  console.log("Company data", companyData.data)

  return (
    <Template pageTitle="Campaigns" >
      <div className="w-full flex justify-end mt-10">
        <Button type="link" onClick={() => void router.push(`/company/${companyData.data?.id as string}/company-analysis`)}>View my company analysis</Button>
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
