import { type NextPage } from "next";

import { api } from "marku/utils/api";
import Template, { ExpandingDiv } from "marku/components/layout/Template";
import Link from "next/link";

const Home: NextPage = () => {

  return (
    <Template pageTitle="Home">
      <div className="mt-10">
        <div>App is cool</div>
        <Link href="/company-info">Provide info about your company</Link>
        <Link href="/campaigns">View campaigns</Link>
        <Link href="/campaign/new">Create a new campaign</Link>
      </div>
      <ExpandingDiv />
    </Template>
  );
};

export default Home;

