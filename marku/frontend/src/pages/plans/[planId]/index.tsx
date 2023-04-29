
import type { NextPage } from "next";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Divider } from "antd";
import { useRouter } from "next/router";
import z from "zod";
import { message } from "antd";
import useSWR from 'swr';

import Template from "../../../components/layout/Template";
import { DateRangePicker, TextInputField } from "../../../components/generic/Inputs";
import { createOrUpdatePlan, createPreferences } from "../../../util/api/apiCalls";
import { authenticatedFetcher } from "../../../util/api/genericApi";
import { env } from '../../../environment/client.mjs'
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import type { MeRespose, PlanResponseType, PreferenceType } from "../../../util/apiTypes";
import { useEffect } from "react";
import StaticBackground from "../../../components/generic/StaticBackground";


const inputValidationSchema = z.object({
  tripName: z.string({ required_error: "Please enter a name for your trip" }).nonempty(),
  startingPoint: z
    .string({ required_error: "Please enter your starting point." })
    .nonempty(),
  dateRange: z
    .array(z.date(), { required_error: "Please enter your date range." })
    .length(2)
    .nonempty(),
});

type InputValidationSchema = z.infer<typeof inputValidationSchema>;


const MandatoryVariables: NextPage = () => {
  const router = useRouter();
  const { planId } = router.query;
  const { data: meResponse, error: meError, isLoading: userIsLoading } = useSWR<MeRespose>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/users/me`,
    authenticatedFetcher
  )

  const { data: planData, isLoading: planIsLoading } = useSWR<PlanResponseType>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/plans/${planId}`,
    authenticatedFetcher
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<InputValidationSchema>({
    resolver: zodResolver(inputValidationSchema),
  });

  useEffect(() => {
    console.log("HGere", planData)
    if (!planIsLoading && planData) {
      setValue("tripName", planData.name)
    }
  }, [planIsLoading, planData, setValue])


  const onSubmit: SubmitHandler<InputValidationSchema> = async ({ startingPoint, dateRange, tripName }) => {
    const planResponse = await createOrUpdatePlan(tripName, planId as string);
    if (planResponse.error || !planResponse.data) {
      message.error(planResponse.error ? planResponse.error : "An unexpected error occurecd");
      if (planResponse.error?.includes("401")) {
        router.push(`/login?nextPage=${router.asPath}`)
      }
      return
    }

    // TODO I think this is bad, the server should know me and not the client
    if (meError || !meResponse) {
      message.error("Could not authenticate you, please log in again")
      router.push(`/login?nextPage=${router.asPath}`)
      return
    }

    const preferencesResponse = await createPreferences(
      {
        start_date: dateRange[0],
        end_date: dateRange[1] as Date,
        start_city: startingPoint,
        taste_dict: {} as PreferenceType,
      },
      meResponse.id,
      planResponse.data.id,
    )

    if (preferencesResponse.error || !preferencesResponse.data) {
      message.error(preferencesResponse.error ? preferencesResponse.error : "An unexpected error occurecd");
      return
    }
    router.push(`/plans/${planResponse.data.id}/preferenceExtraction`);
  };


  return (
    <ProtectedRoute>
      <StaticBackground />
      <Template pageTitle="Create a new plan">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="font-dm-serif-display font-semibold pt-10 text-center text-xl md:pt-14 md:text-2xl lg:pt-20 lg:text-3xl">
            let's start with the basics
          </div>


          <Card className="mb-4 mt-8 md:max-2xl:mt-28">

            <div className="pb-2 md:max-xl:pb-5 text-center text-lg font-semibold md:text-lg lg:text-xl">
              <div className="pb-3">
                Please give your trip a name
              </div>
              <TextInputField
                fieldName="tripName"
                placeholder="Amazing romantic trip"
                control={control}
                error={errors.tripName}
              />
            </div>

            <Divider />

            <div className="pb-2 md:max-xl:pb-5 text-center text-lg font-semibold md:text-lg lg:text-xl">
              <div className="pb-3">
                Where are you starting
              </div>
              {/* <CityAutoCompleteField /> */}
              <TextInputField
                fieldName="startingPoint"
                placeholder="Amsterdam, the Netherlands"
                control={control}
                error={errors.startingPoint}
              />
            </div>

            <Divider />

            <div className="text-center text-lg font-semibold md:text-lg lg:text-xl">
              <div className="pb-3">
                When are you available?
              </div>
              <DateRangePicker
                fieldName="dateRange"
                control={control}
                error={errors.dateRange}
              />
            </div>
            <div className="flex justify-end pt-8">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Card>
        </form>
      </Template>
    </ProtectedRoute>
  );
};

export default MandatoryVariables;

