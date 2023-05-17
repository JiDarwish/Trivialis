import React from 'react';
import { useRouter } from 'next/router';
import Template from 'marku/components/layout/Template';
import Loading from 'marku/components/layout/Loading';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import { api } from 'marku/utils/api';

const CompanyAnalysis: React.FC = () => {
  const router = useRouter();
  const { companyId } = router.query;
  const { data, isLoading, isError } = api.companyReport.getMyCompanyReport.useQuery({})

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {

    console.log("There was an error bro")
  }

  console.log(data)

  return (
    <ProtectedRoute>
      <Template pageTitle="Company Analysis">
        <div className="w-full flex flex-col items-center">
          <div className="text-3xl mt-10">Company Analysis</div>
          Almost there
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CompanyAnalysis;


