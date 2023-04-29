import { Button } from "antd";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../components/contextsAndHooks/AuthProvider";
import Template, { ExpandingDiv } from "../components/layout/Template";
import StaticBackground from "../components/generic/StaticBackground";

const Onboarding: NextPage = () => {
  const { isAuthenticated } = useAuth()
  const nextPageHref = isAuthenticated ? "/plans" : {
    pathname: "/login",
    query: {
      nextPage: "plans",
    }
  }

  return (
    <Template pageTitle="Onboarding">
      <StaticBackground />
      <div className="w-full h-full flex justify-center">
        <div className="relative w-11/12 md:w-7/12 lg:w-5/12 lg:h-5/12">
          <Image src="/onboardingIllustration.png" alt="Onboarding" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>

      <ExpandingDiv />

      <div className="mb-8 md:mb-12 lg:mb-14 text-center">
        <div className="text-xl md:text-3xl lg:text-5xl font-bold pb-4">Let's plan a trip for both of you!</div>
        <div className="text-xs md:text-md lg:text-lg">Everyone has their own <span className="font-semibold">starting point</span> and <span className="font-semibold">different preferences</span>
          - let’s see where you can <span className="font-semibold">meet at the middle.</span></div>
      </div>

      <div className="w-full flex justify-center pb-10 md:pb-20 lg:pb-20">
        <Link href={nextPageHref}>
          <Button type="primary">Get Started</Button>
        </Link>
      </div>
    </Template>
  );
};

export default Onboarding;

