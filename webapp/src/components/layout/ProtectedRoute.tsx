import type { ReactNode, FC } from "react";
import { useSession } from "next-auth/react"

import Loading from "./Loading";


const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {

  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    return <div>Unauthenticated</div>
  }

  console.log("session", session)

  return (
    <>
      {children}
    </>
  )

}


export default ProtectedRoute
