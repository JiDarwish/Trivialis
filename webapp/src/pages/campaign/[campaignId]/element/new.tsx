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
import Loading from 'marku/components/layout/Loading';

type FormData = {
  elementName: string;
  elementDescription: string;
};

const elementSchema = z.object({
  elementName: z.string().min(1, 'Element name is required'),
  elementDescription: z.string().min(1, 'Element description is required'),
});

type ElementSchemaType = z.infer<typeof elementSchema>;

const CreateElement: React.FC = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const createElementMutation = api.element.createElement.useMutation();
  const { data: campaignResponse, isLoading, isError } = api.campaign.getCampaignById.useQuery(
    { id: campaignId as string },
    { enabled: !!campaignId },
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ElementSchemaType>({
    resolver: zodResolver(elementSchema),
  });

  // If not ready to render, show loading
  if (isLoading) {
    return <Loading />;
  }

  // TODO - handle error
  if (isError) {
    return <div>Error bitch</div>
  }

  const campaignName = campaignResponse.data?.name

  const onSubmit = async (data: FormData) => {
    const createElementRes = await createElementMutation.mutateAsync({
      elementName: data.elementName,
      elementDescription: data.elementDescription,
      campaignId: campaignId as string,
    });

    if (createElementRes.status === 'success') {
      message.success('Element created successfully');
      console.log("response was", createElementRes.data)
      router.push(`/campaign/${campaignId as string}/element/${createElementRes.data?.id as string}/`);
    } else {
      message.error('Failed to create element');
    }
  };

  return (
    <ProtectedRoute>
      <Template pageTitle="Create Element">
        <div className="w-full flex flex-col items-center mt-10">
          <div className="text-3xl">Create element for {campaignName} campain</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-1/2 flex flex-col space-y-4"
          >
            <div className="flex flex-col">
              <label htmlFor="elementName" className="text-lg font-semibold">
                Element Name
              </label>
              <TextInputField
                fieldName="elementName"
                control={control}
                error={errors.elementName}
                placeholder="Enter your element name"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="elementDescription" className="text-lg font-semibold">
                Element Description
              </label>
              <TextAreaField
                fieldName="elementDescription"
                control={control}
                error={errors.elementDescription}
                placeholder="Enter your element description"
                rows={4}
              />
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Create Element
              </Button>
            </div>
          </form>
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CreateElement;

