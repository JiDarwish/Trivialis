import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AppTitle from "../../../components/generic/AppTitle";
import Template from "../../../components/layout/Template";
import Loading from "../../../components/layout/Loading";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import { generatePackages } from "../../../util/api/apiCalls";
import { message } from "antd";
import StaticBackground from "../../../components/generic/StaticBackground";


const GeneratePackages: NextPage = () => {
  const router = useRouter();
  const { planId } = router.query;
  const [packagesResponse, setPackagesResponse] = useState<any>();

  useEffect(() => {
    (async () => {
      if (!planId) return;
      const response = await generatePackages(planId as string);
      if (!response || response.error || !response.data) {
        message.error("Error generating packages");
        return
      }
      setPackagesResponse(response.data);
      message.success("Packages generated");
      router.push(`/plans/${planId}/packages`);
    })()
  }, [planId, router]);

  console.log(packagesResponse);
  return (
    <ProtectedRoute>
      <Template pageTitle="Generating your package">
        <StaticBackground />
        <AppTitle />
        <Loading />
      </Template>
    </ProtectedRoute>
  );
};

export default GeneratePackages;

