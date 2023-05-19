import {type ReactNode, type FC, useEffect } from "react";
import { useSession } from "next-auth/react"

import Loading from "./Loading";
import { message } from "antd";
import { useRouter } from "next/router";


const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession()
  const router = useRouter()
  const signInRedirectUri = "http://localhost:3000/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F"

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push(signInRedirectUri)
    }
  }, [status, router])

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    void message.error("You must be logged in to view this page")
    return <Loading />
  }


  return (
    <>
      {children}
    </>
  )

}


export default ProtectedRoute


