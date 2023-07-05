import { type NextPage } from "next";

import Template, { ExpandingDiv } from "marku/components/layout/Template";
import Link from "next/link";

const Home: NextPage = () => {

  return (
    <Template pageTitle="Home">
      <div className="mt-10">
        <div className="flex flex-col">
          <div className="text-3xl">Help us <Link href="/company-info">get to know you as a company</Link></div>
        </div>
      </div>
      <ExpandingDiv />
    </Template>
  );
};

export default Home;
