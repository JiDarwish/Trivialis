
import { type NextPage } from "next";
import { Button } from "antd";
import useSWR from "swr";
import { useState } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { env } from '../../../environment/client.mjs'
import preferenceImages from '../../../util/preferemceImages'
import Template from "../../../components/layout/Template";
import PreferenceCard from "../../../components/generic/PreferenceCard";
import { createPreferences } from "../../../util/api/apiCalls";
import { authenticatedFetcher } from "../../../util/api/genericApi";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import type { MeRespose, PreferencesResponse } from "../../../util/apiTypes.js";
import StaticBackground from "../../../components/generic/StaticBackground";

const PreferenceExtraction: NextPage = () => {
  type BodyType = { [key: string]: { value: number, importance: number } }
  const [body, setBody] = useState<BodyType>({});
  const router = useRouter()
  const { planId } = router.query
  const { data: meResponse, error: meError } = useSWR<MeRespose>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/users/me`,
    authenticatedFetcher
  )
  const { data: preferencesResponse, error: preferencesError } = useSWR<PreferencesResponse[]>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/preferences/plan/${planId}`,
    authenticatedFetcher
  )

  const handleSelectBodyItem = (key: string, value: number) => {
    setBody((prevBody: BodyType) => ({ ...prevBody, [key]: { value, importance: 10 } }));
  };

  const onSubmit = async () => {
    if (meError || !meResponse) {
      message.error("Could not authenticate you, please log in again")
      router.push(`/login?nextPage=${router.asPath}`)
      return
    }

    const myPrefernces = preferencesResponse?.find(preference => preference.user_id === meResponse.id);
    if (preferencesError || !preferencesResponse || !myPrefernces) {
      message.error("Could not fetch preferences, please try again")
      return
    }

    const response = await createPreferences(
      {
        start_date: dayjs(myPrefernces.start_date).toDate(),
        end_date: dayjs(myPrefernces.end_date).toDate(),
        start_city: myPrefernces.start_city,
        taste_dict: body,
      },
      meResponse.id,
      parseInt(planId as string),
    );

    if (response.error || !response.data) {
      message.error(response.error ? response.error : "An unexpected error occurecd");
      if (response.error?.includes("401")) {
        router.push(`/login?nextPage=${router.asPath}`)
      }
      return
    }

    router.push(`/plans/${planId}/sharePlan`)
  }

  return (
    <ProtectedRoute>
      <StaticBackground />
      <Template pageTitle="Preference Extraction">
        <div className="text-center font-dm-serif-display pt-8 md:pt-12 lg:pt-16 pb-10 text-lg md:text-xl lg:text-2xl">
          help us understand what is important to you while taking this trip
        </div>

        {preferenceImages.map((imageSet, index) => (
          <>
            <div key={index} className={`${index !== preferenceImages.length - 1 ? "mb-5 md:max-xl:mb-8" : ""}`}>
              <PreferenceCard
                {...imageSet}
                handleSelect={(value: number) => handleSelectBodyItem(imageSet.key, value)} />
            </div>
            <div className="h-20" />
          </>
        ))}

        <div className="py-10">
          <Button onClick={onSubmit} type="primary">Submit</Button>
        </div>
      </Template>
    </ProtectedRoute>
  );
};

export default PreferenceExtraction; 
