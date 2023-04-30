import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, message } from 'antd';
import Template from 'marku/components/layout/Template';
import { api } from 'marku/utils/api';
import { TextAreaField, TextInputField } from 'marku/components/generic/Inputs';
import { useSession } from 'next-auth/react';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import { useRouter } from 'next/router';


type FormData = {
  companyName: string;
  companyDescription: string;
};

const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyDescription: z.string().min(1, 'Company description is required'),
});



type CompanySchemaType = z.infer<typeof companySchema>;

const CompanyInfo: React.FC = () => {
  const router = useRouter();
  const updateCompanyInfoMutation = api.company.updateInformation.useMutation({
      onSuccess: () => {
        void message.success("Company information updated successfully");
        void router.push("/");
      }
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = (data: FormData) => {
    updateCompanyInfoMutation.mutate({
      name: data.companyName,
      description: data.companyDescription,
    })
  };

  console.log("Data back is ", updateCompanyInfoMutation.data);

  return (
    <ProtectedRoute>
      <Template pageTitle="Company Information">
        <div className="w-full flex flex-col items-center">
          <div className='text-3xl'>Company Information</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-1/2 flex flex-col space-y-4"
          >
            <div className="flex flex-col">
              <label htmlFor="companyName" className="text-lg font-semibold">
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
              <label htmlFor="companyDescription" className="text-lg font-semibold">
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

