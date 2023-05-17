/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, message } from 'antd';
import Template from 'marku/components/layout/Template';
import { api } from 'marku/utils/api';
import { TextAreaField, TextInputField } from 'marku/components/generic/Inputs';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import { useRouter } from 'next/router';


type FormData = {
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  toneAndVoice: string;
  preferredTargetAudience: string;
  socialMediaLinks: string;
};

// type ApiCompanyResponse = {
//   competitors: string;
//   social_media_apps: string;
//   industries_and_sectors: string;
//   key_selling_points: string;
//   subreddits: string;
//   new_releases: string;
// }

// async function retryFetch<T>(url: string, options?: RequestInit, retries = 4, delay = 500): Promise<T> {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await typedFetch<T>(url, options);
//     } catch (error) {
//       if (i < retries - 1) {
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error("Retry limit exceeded");
// }
//
// async function typedFetch<T>(url: string, options?: RequestInit): Promise<T> {
//   const controller = new AbortController()
//   const timeoutId = setTimeout(() => controller.abort(), 100000)
//   const response = await fetch(url, {
//     ...options,
//     signal: controller.signal
//   });
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   return await response.json();
// }
//
const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().min(1, 'Company website is required'),
  companyDescription: z.string().min(1, 'Company description is required'),
  toneAndVoice: z.string().min(0),
  preferredTargetAudience: z.string().min(0),
  socialMediaLinks: z.string().min(0),
});

type CompanySchemaType = z.infer<typeof companySchema>;

const CompanyInfo: React.FC = () => {
  const router = useRouter();
  const updateCompanyInfoMutation = api.company.updateInformation.useMutation();
  // const saveMyCompanyReportMutation = api.


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
  });

  const updateCompanyInfo = async (data: FormData) => {
    const savedCompany = await updateCompanyInfoMutation.mutateAsync({
      name: data.companyName,
      website: data.companyWebsite,
      description: data.companyDescription,
      toneAndVoice: data.toneAndVoice,
      preferredTargetAudience: data.preferredTargetAudience,
      socialMediaLinks: data.socialMediaLinks,
    })

    return savedCompany;
  }

  const onSubmitToAnalysis = async (data: FormData) => {
    try {
    void message.loading("Loading, this might take a while...")
    const companyRes = await updateCompanyInfo(data);
    console.log("ComapnyRes", companyRes) 
    console.log("ComapnyRes message", companyRes.message) 
    console.log("ComapnyRes status", companyRes.status) 
    console.log("ComapnyRes data", companyRes.data) 
    if (!companyRes.data) {

      void message.error('Error updating company info');
      return;
    }

    void router.push(`/company/${companyRes.data.id}/company-analysis`);
    } catch (e) {
      console.error(e);

    }
  };

  const onSubmitToCampaign = async (data: FormData) => {
    const companyRes = await updateCompanyInfo(data);

    if (!companyRes.data) {
      void message.error('Error updating company info');
      return;
    }

    void router.push(`/campaigns`);
  };


  return (
    <ProtectedRoute>
      <Template pageTitle="Company Information">
        <div className="w-full flex flex-col items-center">
          <Card
            className="w-full md:w-1/2 flex flex-col space-y-4 mt-5 bg-[#531DAB] text-white"
          >
            <form>
              <div className='font-bold text-2xl mb-4'>Mandatory</div>
              <div className="flex flex-col">
                <label htmlFor="companyName" className="mb-2 ">
                  Company Name
                </label>
                <TextInputField
                  fieldName="companyName"
                  control={control}
                  error={errors.companyName}
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <div className="text-sm text-red-500">
                    {errors.companyName.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="companyWebsite" className=" mb-2 ">
                  Company Website
                </label>
                <TextInputField
                  fieldName="companyWebsite"
                  control={control}
                  error={errors.companyWebsite}
                  placeholder="Enter your company website"
                />
                {errors.companyWebsite && (
                  <div className="text-sm text-red-500">
                    {errors.companyWebsite.message}
                  </div>
                )}
              </div>

              <div className="font-bold text-2xl mt-8 mb-6">Optional</div>
              <div className="flex flex-col">
                <label htmlFor="companyDescription" className=" mb-2 ">
                  Company Description
                </label>
                <TextAreaField
                  fieldName="companyDescription"
                  control={control}
                  error={errors.companyDescription}
                  placeholder="Enter your company description"
                  rows={4}
                />
                {errors.companyDescription && (
                  <div className="text-sm text-red-500">
                    {errors.companyDescription.message}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="toneAndVoice" className=" my-3 ">
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
                <label htmlFor="preferredTargetAudience" className="my-3">
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
                <label htmlFor="socialMediaLinks" className="my-3">
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
              <div className="w-full flex justify-end mt-4">
                <Button type="ghost" onClick={handleSubmit(onSubmitToAnalysis)}>
                  View market analysis results
                </Button>
                <Button type="primary" onClick={handleSubmit(onSubmitToCampaign)}>
                  Create a campaign
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CompanyInfo;

