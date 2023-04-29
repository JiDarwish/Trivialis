import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import Loading from "../../../../components/layout/Loading";
import Error from "../../../../components/layout/Error";
import ProtectedRoute from "../../../../components/layout/ProtectedRoute";
import Template from "../../../../components/layout/Template";
import { env } from "../../../../environment/client.mjs";
import { authenticatedFetcher } from "../../../../util/api/genericApi";
import type { PackageResponse } from "../../../../util/apiTypes";
import TransportItem from "../../../../components/generic/TransportItem";
import StaticBackground from "../../../../components/generic/StaticBackground";
import { Card } from "antd";

const PackageDisplay: NextPage = () => {
  const router = useRouter();
  const { packageId, planId } = router.query;
  const [pageTitle, setPagetitle] = useState("Package Display");

  const { data: packageData, isLoading: packageLoading, error: packageError } = useSWR<PackageResponse>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/${planId}/packages/${packageId}`,
    authenticatedFetcher
  );

  useEffect(() => {
    if (packageData) setPagetitle(`${packageData.name} package`);
  }, [packageLoading, packageError, packageData])

  if (packageError) {
    return <Error />
  }

  console.log("Package Data", JSON.stringify(packageData, null, 2))
  return (
    <ProtectedRoute>
      <StaticBackground />
      <Template pageTitle={pageTitle}>
        {packageLoading && <Loading />}
        {packageData &&
          <div className="w-11/12 md:max-2xl:w-9/12 pt-20">
            <div className="font-dm-serif-display text-4xl">{packageData.name}</div>


            <Card title="Inbound flights" className="my-10">
              {packageData.transports.filter(item => item.transport_type === 'Inbound').map((transportItem, index) => (
                <div key={index} className={`${index !== 1 ? 'mb-2' : ''}`}>
                  <TransportItem transportItem={transportItem} />
                </div>
              ))}
            </Card>

            <Card title="Outbound flights">
              {packageData.transports.filter(item => item.transport_type === 'Outbound').map((transportItem, index) => (
                <div key={index} className={`${index !== 1 ? 'mb-2' : ''}`}>
                  <TransportItem key={index} transportItem={transportItem} />
                </div>
              ))}
            </Card>
          </div>
        }
      </Template>
    </ProtectedRoute>
  );
};

export default PackageDisplay;


