import React from 'react';
import { useRouter } from 'next/router';
import Template from 'marku/components/layout/Template';
import Loading from 'marku/components/layout/Loading';
import ProtectedRoute from 'marku/components/layout/ProtectedRoute';
import { api } from 'marku/utils/api';
import Link from 'next/link';
import { Button } from 'antd';

const exampleData = {
  "competitors": "Wayfair, Walmart, Bed Bath & Beyond, HomeGoods, Amazon, Overstock",
  "socialMediaApps": "Facebook, Instagram, Pinterest, Twitter, YouTube, LinkedIn, TikTok",
  "industriesAndSectors": "Retail, Furniture, Home Furnishing, E-commerce",
  "keySellingPoints": "Affordable prices, Flat-pack assembly, Scandinavian design, Sustainability initiatives, Wide range of home furnishing products, Integrated smart home solutions",
  "subreddits": "r/IKEA, r/IKEAhacks, r/IKEAUK, r/IKEAAustralia",
  "newReleases": "HEMLIG Art Collection, LIVLIG Vegan Meatballs, STILREN Smart Home Range, GRÖNLIG Plant-based Furniture Line, VÄRLDENS Sustainable Kitchen Series"
}
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
        <div className="w-full flex justify-end mt-10">
          <Button type="primary" onClick={() => void router.push('/campaigns')}>Get back to campaigns</Button>
        </div>
        <div className="w-full flex flex-wrap justify-center p-5">
          {Object.entries(exampleData).map(([key, value]) => {
            return (
              <div key={key} className="m-5">
                <div className="w-64 bg-blue-100 rounded p-5">
                  <h2 className="font-bold text-lg mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h2>
                  <p>{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default CompanyAnalysis;


