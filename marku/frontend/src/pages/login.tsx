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

const loginSchema = z.object({
  email: z.string({ required_error: "Please enter your email" }).email().nonempty(),
  password: z.string({ required_error: "Please enter your password" }).nonempty(),
});

type LoginSchema = z.infer<typeof loginSchema>;

const Login: NextPage = () => {
  const { login } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { nextPage, code } = router.query

  const onSubmit: SubmitHandler<LoginSchema> = async (data: LoginSchema) => {
    const error = await login(data.email, data.password);
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
    <Template pageTitle="Login">
      <BackgroundSlider />
      <AppTitle />
      <ExpandingDiv />

      <Card className="px-3 md:max-xl:px-6">
        <div className="pb-8">Log in or {" "}
          <span><Link href={{
            pathname: "/signup",
            query: {
              nextPage,
              code,
            }
          }}>Sign up</Link></span> {" "}
          to continue
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            fieldName="email"
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
          <div className="pt-6 flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              Login
            </Button>
          </div>
        </form>
      </Card>

      <ExpandingDiv />
      <ExpandingDiv />
    </Template>
  );
};

export default Login;
