import { type NextPage } from "next";
import useSWR from "swr";
import { useRouter } from "next/router";

import AppTitle from "../../../../components/generic/AppTitle";
import Template from "../../../../components/layout/Template";
import Loading from "../../../../components/layout/Loading";
import ProtectedRoute from "../../../../components/layout/ProtectedRoute";
import { authenticatedFetcher } from "../../../../util/api/genericApi";
import type { PackageResponse } from "../../../../util/apiTypes";
import { env } from "../../../../environment/client.mjs";
import PackageCard from "../../../../components/generic/PackageCard";
import StaticBackground from "../../../../components/generic/StaticBackground";

const Packages: NextPage = () => {
  const router = useRouter();
  const { planId } = router.query;

  const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useSWR<PackageResponse[]>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/${planId}/packages`,
    authenticatedFetcher
  );


  console.log(packagesData);

  return (
    <ProtectedRoute>
      <Template pageTitle="Packages">
        <StaticBackground />
        <AppTitle />
        <div className="w-11/12 md:max-xl:w-9/12 mt-5 md:max-xl:mt-10">
          {packagesLoading && <Loading />}
          {packagesError && <div>There was an error loading your packages</div>}
          {/* Sort packages by price ascending */}
          {packagesData && packagesData?.sort((a, b) => a.total_price - b.total_price).map((packageItem, index) => (
            <>
              <PackageCard key={packageItem.id} packageItem={packageItem} />
              {index !== packagesData.length - 1 && <div className="h-4" />}
            </>
          ))}
        </div>

      </Template>
    </ProtectedRoute>
  );
};

export default Packages;
