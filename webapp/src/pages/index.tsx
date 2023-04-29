import { type NextPage } from "next";

import { api } from "marku/utils/api";
import Template from "marku/components/layout/Template";

const Home: NextPage = () => {
  return (
    <Template pageTitle="Home">
      <div>Hi there</div>
    </Template>
  );
};

export default Home;

