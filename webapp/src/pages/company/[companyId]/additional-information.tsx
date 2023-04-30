/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, message } from 'antd';
import Template from 'marku/components/layout/Template';
import { api } from 'marku/utils/api';
import { TextAreaField, TextInputField } from 'marku/components/generic/Inputs';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import { useRouter } from 'next/router';


type FormData = {
  toneAndVoice: string;
  preferredTargetAudience: string;
  socialMediaLinks: string;
};

const companySchema = z.object({
  toneAndVoice: z.string().min(0), 
  preferredTargetAudience: z.string().min(0),
  socialMediaLinks: z.string().min(0),
});

type CompanySchemaType = z.infer<typeof companySchema>;

const CompanyInfo: React.FC = () => {
  const router = useRouter();
  const updateAdditionalCompanyInformation = api.company.updateAdditionalCompanyInformation.useMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: FormData) => {
    const updateCompanyRes = await updateAdditionalCompanyInformation.mutateAsync({
      toneAndVoice: data.toneAndVoice,
      preferredTargetAudience: data.preferredTargetAudience,
      socialMediaLinks: data.socialMediaLinks,
    })

    if(!updateCompanyRes.data) {
      void message.error('Error updating company info');
      return;
    }

    void router.push(`/company/${updateCompanyRes.data.id}/company-analysis`);

  };

  return (
    <ProtectedRoute>
      <Template pageTitle="Company Information">
        <div className="w-full flex flex-col items-center">
          <div className='text-3xl'>Company Information</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-1/2 flex flex-col space-y-4"
          >
           {/*Create similar fields like the ones below for toneAndVoice, preferredTargetAudience, socialMediaLinks*/} 
            <div className="flex flex-col">
              <label htmlFor="toneAndVoice" className="text-lg font-semibold">
                Tone and voice of your company
              </label>
              <TextInputField
                fieldName="toneAndVoice"
                control={control}
                error={errors.toneAndVoice}
                placeholder="Enter your tone and voice"
              />
              {errors.toneAndVoice && (
                <div className="text-sm text-red-500">
                  {errors.toneAndVoice.message}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="preferredTargetAudience" className="text-lg font-semibold">
                Company preferred target audience
              </label>
              <TextInputField
                fieldName="preferredTargetAudience"
                control={control}
                error={errors.preferredTargetAudience}
                placeholder="Enter your company preferred target audience"
              />
              {errors.preferredTargetAudience && (
                <div className="text-sm text-red-500">
                  {errors.preferredTargetAudience.message}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="socialMediaLinks" className="text-lg font-semibold">
                Company social medial links
              </label>
              <TextAreaField
                fieldName="socialMediaLinks"
                control={control}
                error={errors.socialMediaLinks}
                placeholder="Enter your company social media links"
                rows={4}
              />
              {errors.socialMediaLinks && (
                <div className="text-sm text-red-500">
                  {errors.socialMediaLinks.message}
                </div>
              )}
            </div>
            <div>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CompanyInfo;


