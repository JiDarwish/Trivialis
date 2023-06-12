import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { TextInputField } from "./Inputs";
import { Button, Spin, Alert, message } from "antd";
import { api } from "marku/utils/api";
import { ApiResponse } from "marku/utils/apiResponses";
import { WaitingListUser } from "@prisma/client";

const betaFormSchema = z.object({
  email: z.string().email().min(1, { message: "Please enter a valid email address" }),
});

type BetaFormSchemaType = z.infer<typeof betaFormSchema>;

const BetaForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BetaFormSchemaType>({
    resolver: zodResolver(betaFormSchema),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addToWaitingListMutation = api.waitingListRouter.addToWaitingList.useMutation();

  const onSubmit = (data: BetaFormSchemaType) => {
    setLoading(true);
    console.log(data);
    const response: ApiResponse<WaitingListUser> = addToWaitingListMutation.mutateAsync({ email: data.email })
      .then(res => {
        setLoading(false)
        setSuccess(res.status === "success")
        if (res.status !== "success") {
          void message.error(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false)
        setSuccess(false)
        void message.error("Something went wrong. Please try again later.")
      })

  }

  return (
    <div>
      {success ?
        <Alert message="Success! You're on the waiting list!" type="success" showIcon />
        :
        <>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex">
            <TextInputField
              fieldName="email"
              control={control}
              error={undefined}
              placeholder="Enter your email"
            />
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin /> : 'Sign up'}
            </Button>
          </form>
          {errors.email && <div className="text-left w-full text-sm text-red-500">{errors.email.message}</div>}
        </>
      }

    </div>
  );
};

export default BetaForm;
