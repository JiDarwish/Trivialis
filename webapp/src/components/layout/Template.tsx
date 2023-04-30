
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import type { FC } from "react";
import { UserOutlined } from '@ant-design/icons';
import { Layout, Button } from 'antd';
import Link from "next/link";

const { Header } = Layout;

const NavBar: FC = () => {
  const { data: session } = useSession();
  return (
    <Header>
      <div className="flex justify-between w-full items-center">
        <div>
          <Link href='/' className="text-white">
            <span className="text-6xl mr-4">Marku</span>
            <span className="text-xs">Marketing for you</span>
          </Link>
        </div>

        <div>
          <div>
            {!session ? (
              <div>
                <Button 
                  type="link" 
                  onClick={() => void signIn()} 
                > 
                  Sign In 
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  type="link"
                  onClick={() => void signOut()}
                >
                  Sign Out
                </Button>
                <span className="text-white">
                  <UserOutlined /> {session.user.email ? session.user.email : session.user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Header>
  )
}


type TemplateProps = {
  pageTitle: string;
  children: React.ReactNode;
  showNavBar?: boolean;
  // showFooter?: boolean;
  // showAuthButtons?: boolean;
  // classNames?: string;
  // disableCenteredDisplay?: boolean;
};

const Template: React.FC<TemplateProps> = ({
  children,
  pageTitle,
  showNavBar = true,
  // showFooter = true,
  // classNames = "",
  // disableCenteredDisplay = false,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute inset-0">

        {showNavBar &&
          <NavBar />
        }

        <main className="font-opensans max-w-7xl h-full mx-auto px-4 flex flex-col items-center w-11/12">
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
