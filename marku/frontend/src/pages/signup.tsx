import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card } from "antd";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { message } from "antd";

import { useAuth } from "../components/contextsAndHooks/AuthProvider";
import AppTitle from "../components/generic/AppTitle";
import { TextInputField } from "../components/generic/Inputs";
import Template, { ExpandingDiv } from "../components/layout/Template";
import { validateInvite } from "../util/api/apiCalls";
import BackgroundSlider from "../components/generic/BackgroundImages";

const signupSchema = z.object({
  email: z.string({ required_error: "Please enter your email" }).email().nonempty(),
  first_name: z.string({ required_error: "Please enter your first name" }).nonempty(),
  last_name: z.string({ required_error: "Please enter your last name" }).nonempty(),
  password: z.string({ required_error: "Please enter your password" }).nonempty(),
  repeatPassword: z.string({ required_error: "Please confirm your password" }).nonempty(),
}).refine(data => data.password === data.repeatPassword, {
  message: "Passwords must match",
  path: ["repeatPassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>;

const Signup: NextPage = () => {
  const { signUp } = useAuth()
  const router = useRouter();
  const { nextPage, code } = router.query
  const { control, handleSubmit, formState: { errors } } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data: SignupSchema) => {
    const error = await signUp(data);
    if (error) {
      message.error(error.detail)
      return
    }
    if (code) {
      const response = await validateInvite(code as string)
      if (response.error || !response.data) {
        message.error(response.error ? response.error : "An unexpected error occurecd");
        return
      }

      message.success("Invite accepted")
      router.push(`/plans/${response.data.plan_id}`)
      return
    }
    router.push(nextPage ? `/${nextPage}` : "/");
  };

  return (
    <Template pageTitle="Signup">
      <BackgroundSlider />
      <AppTitle />
      <ExpandingDiv />

      <Card className="px-3 md:max-xl:px-6">
        <div className="pb-8">
          Sign up or <span><Link href={{
            pathname: "/login",
            query: {
              nextPage,
              code,
            }
          }}>Log in</Link></span> to continue
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            fieldName="first_name"
            placeholder="First Name"
            control={control}
            error={errors.first_name}
          />
          <div className="h-2" />
          <TextInputField
            fieldName="last_name"
            placeholder="Last Name"
            control={control}
            error={errors.last_name}
          />
          <div className="h-2" />
          <TextInputField
            fieldName="email"
            type="email"
            placeholder="Your email"
            control={control}
            error={errors.email}
          />
          <div className="h-2" />
          <TextInputField
            fieldName="password"
            placeholder="Password"
            control={control}
            type="password"
            error={errors.password}
          />
          <div className="h-2" />
          <TextInputField
            fieldName="repeatPassword"
            placeholder="Confirm Password"
            control={control}
            type="password"
            error={errors.repeatPassword}
          />
          <div className="pt-6 flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              Sign up
            </Button>
          </div>
        </form>
      </Card>

      <ExpandingDiv />
      <ExpandingDiv />
    </Template>
  );
};

export default Signup;
