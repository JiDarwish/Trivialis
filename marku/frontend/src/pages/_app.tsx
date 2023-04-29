import { type AppType } from "next/app";

import "../styles/globals.css";
import { AuthProvider } from "../components/contextsAndHooks/AuthProvider";


const MyApp: AppType<{ pageProtected: boolean }> = ({
  Component,
  pageProps
}) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
