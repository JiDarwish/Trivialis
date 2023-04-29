
import { Button } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import useSWR from "swr";

import { env } from "../../environment/client.mjs";
import { authenticatedFetcher } from "../../util/api/genericApi";
import type { MeRespose as MeResponse } from "../../util/apiTypes.js";
import { useAuth } from "../contextsAndHooks/AuthProvider";

const AuthButtons: FC<{ user: MeResponse | undefined }> = ({ user }) => {
  const router = useRouter()
  const { logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout();
    if (router.route != "/") {
      router.push("/")
    }
  }

  return (
    <div className="mt-5 px-3 md:max-xl:mt-6 md:max-xl:mx-8">
      {isAuthenticated && (
        <div className="flex items-center justify-between">
          <div className="pr-3">{user?.first_name} {user?.last_name}</div>
          <Button onClick={handleLogout} type="primary">Logout</Button>
        </div>
      )}
      {!isAuthenticated && (
        <>
          <Link href="/login">
            <Button type="primary">Login</Button>
          </Link>
          <Link href="/signup">
            <Button type="primary">Signup</Button>
          </Link>
        </>
      )}

    </div>
  )
}

type TemplateProps = {
  pageTitle: string;
  children: React.ReactNode;
  showNavBar?: boolean;
  // showFooter?: boolean;
  showAuthButtons?: boolean;
  // classNames?: string;
  // disableCenteredDisplay?: boolean;
};
const Template: React.FC<TemplateProps> = ({
  children,
  pageTitle,
  showNavBar = false,
  showAuthButtons = false,
  // showFooter = true,
  // classNames = "",
  // disableCenteredDisplay = false,
}) => {
  const { data: meResponse } = useSWR<MeResponse>(
    `${env.NEXT_PUBLIC_BACKEND_URI}/v1/users/me`,
    authenticatedFetcher
  )
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-0 flex flex-col">

        <nav>
          {showNavBar &&
            <Link href="/protected">
              <Button type="ghost">go to protected route</Button>
            </Link>
          }
          {showAuthButtons && <AuthButtons user={meResponse} />}

        </nav>

        <main className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-11/12">
          {children}
        </main>
      </div>
    </>
  );
};
// {`max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-11/12 ${classNames}`}

export const ExpandingDiv: FC = () => {
  return <div className={`flex-grow flex-1`} />
}


export default Template;
