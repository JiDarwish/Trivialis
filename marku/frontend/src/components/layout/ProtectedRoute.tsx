import { message } from "antd";
import { useRouter } from "next/router";
import type { ReactNode, FC } from "react";

import { useAuth } from "../contextsAndHooks/AuthProvider";
import Loading from "./Loading";


const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {

  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    message.error("You are not allowed to view this page, redirecting now")
    router.replace("/") 
  }

  return (
    <>
      {children}
    </>
  )

}


export default ProtectedRoute
