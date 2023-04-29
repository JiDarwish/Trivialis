
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Loading from '../../../components/layout/Loading'

const AcceptInvite : NextPage = () => {
  const router = useRouter()
  const { code } = router.query

  useEffect(() => {
    if (!code) return
    router.replace(`/login?nextPage=/onboarding&code=${code}`)
  }, [code])

  return (
    <Loading />
  )
}

export default AcceptInvite
