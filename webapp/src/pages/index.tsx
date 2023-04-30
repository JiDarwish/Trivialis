import { type NextPage } from "next";

import { api } from "marku/utils/api";
import Template, { ExpandingDiv } from "marku/components/layout/Template";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Template pageTitle="Home">
      <ExpandingDiv />
      <div>
        <div>App is cool</div>
        <div>Provide info about your company</div>
      </div>
      <ExpandingDiv />
    </Template>
  );
};

export default Home;

