import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, message } from 'antd';
import { TextInputField, TextAreaField } from 'marku/components/generic/Inputs';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import Template from 'marku/components/layout/Template';
import { api } from 'marku/utils/api';
import { useRouter } from 'next/router';

type FormData = {
  campaignName: string;
  campaignDescription: string;
  campaignGoal: string;
};

const campaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  campaignDescription: z.string().min(1, 'Campaign description is required'),
  campaignGoal: z.string().min(1, 'Campaign Goal is required'),
});

type CampaignSchemaType = z.infer<typeof campaignSchema>;

const CreateCampaign: React.FC = () => {
  const router = useRouter();
  const createCampaignMutation = api.campaign.createCampaign.useMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampaignSchemaType>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = async (data: FormData) => {
    const bla = await createCampaignMutation.mutateAsync({
      campaignName: data.campaignName,
      campaignDescription: data.campaignDescription,
      campaignGoal: data.campaignGoal,
    });
    if (bla.status === 'success') {
      message.success('Campaign created successfully');
      router.push(`/campaign/${bla.data?.id}`);
    } else {
      message.error('Failed to create campaign');
    }
  };

  return (
    <ProtectedRoute>
      <Template pageTitle="Create Campaign">
        <div className="w-full flex flex-col items-center">
          <div className="text-3xl">Create Campaign</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-1/2 flex flex-col space-y-4"
          >
            <div className="flex flex-col">
              <label htmlFor="campaignName" className="text-lg font-semibold">
                Campaign Name
              </label>
              <TextInputField
                fieldName="campaignName"
                control={control}
                error={errors.campaignName}
                placeholder="Enter your campaign name"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="campaignDescription" className="text-lg font-semibold">
                Campaign Description
              </label>
              <TextAreaField
                fieldName="campaignDescription"
                control={control}
                error={errors.campaignDescription}
                placeholder="Enter your campaign description"
                rows={4}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="campaignGoal" className="text-lg font-semibold">
                Campaign Goal
              </label>
              <TextInputField
                fieldName="campaignGoal"
                control={control}
                error={errors.campaignGoal}
                placeholder="Enter your campaign goal"
              />
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Create Campaign
              </Button>
            </div>
          </form>
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CreateCampaign;
