
import Head from "next/head";
import Link from "next/link";
import type { FC } from "react";

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
              <button>go to protected route</button>
            </Link>
          }
          {showAuthButtons && <div>Auth buttons here</div>}

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
