import { type NextPage } from "next";
import useSWR from "swr";

import Loading from "../components/layout/Loading";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Template from "../components/layout/Template";
import { env } from "../environment/client.mjs";
import { authenticatedFetcher } from "../util/api/genericApi";
import PlanCard from "../components/generic/PlanCard";
import type { MeRespose, PlanResponseType } from "../util/apiTypes";
import { Button, message } from "antd";
import { createOrUpdatePlan, createPreferences } from "../util/api/apiCalls";
import { useRouter } from "next/router";
import StaticBackground from "../components/generic/StaticBackground";

const Plans: NextPage = () => {
  const router = useRouter();
  const { data: meResponse, error: meError } = useSWR<MeRespose>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/users/me`,
    authenticatedFetcher
  )
  const { isLoading, error, data: plansData, mutate } = useSWR<PlanResponseType[]>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/me`,
    authenticatedFetcher
  );

  const handleCreateNewPlan = async () => {
    // Make sure this user is authenticated and can do shit
    if (meError || !meResponse) {
      message.error("Could not authenticate you, please log in again")
      router.push(`/login?nextPage=${router.asPath}`)
      return
    }

    // Create new plan to attach preferences to
    const newPlan = await createOrUpdatePlan("");
    if (newPlan.error || !newPlan.data) {
      message.error(newPlan.error ? newPlan.error : "An unexpected error occurecd");
      return;
    }

    // Create new empty preferences for the next page
    const newPreferences = await createPreferences(
      {},
      meResponse.id,
      newPlan.data.id,
      "POST",
    )

    if (newPreferences.error || !newPreferences.data) {
      message.error(newPreferences.error ? newPreferences.error : "An unexpected error occurecd");
      return;
    }
    router.push(`/plans/${newPlan.data.id}`)
  };

  return (
    <ProtectedRoute>
      <StaticBackground />
      <Template pageTitle="My plans" showAuthButtons={true}>
        <div className="w-full md:max-xl:w-10/12">
          <div className="pt-12 pb-5 md:max-xl:pt-20 md:max-xl:pb-10 flex justify-between">
            <div className="text-2xl md:text-5xl font-dm-serif-display">my plans</div>
            <div>
              <Button type="primary" size="middle" onClick={handleCreateNewPlan}>New plan</Button>
            </div>
          </div>
          {isLoading && <Loading />}
          {error && <div>Failed to load</div>}
          {plansData && (
            plansData?.map((plan, index) => (
              <>
                <PlanCard key={plan.id} plan={plan} onPlanDelete={() => mutate()} />
                {index !== plansData.length - 1 && <div className="h-10" />}
              </>
            ))
          )}
        </div>
      </Template>
    </ProtectedRoute>
  );
}

export default Plans;
