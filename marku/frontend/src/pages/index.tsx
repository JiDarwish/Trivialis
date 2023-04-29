import { type NextPage } from "next";
import { Button } from "antd";
import Link from "next/link";

import Template, { ExpandingDiv } from "../components/layout/Template";
import AppTitle from "../components/generic/AppTitle";
import BackgroundSlider from "../components/generic/BackgroundImages";

const Home: NextPage = () => {

  return (
    <Template pageTitle="Landing">
      <BackgroundSlider />

      <AppTitle />

      <ExpandingDiv />

      <div className="pb-14 md:pb-28 lg:pb-32">
        <Link href="/onboarding">
          <Button type="primary" size="large">
            Get Started
          </Button>
        </Link>
      </div>

    </Template>
  );
};


export default Home;
