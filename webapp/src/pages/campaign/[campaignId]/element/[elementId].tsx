import { Button, message } from "antd";
import Template from "marku/components/layout/Template";
import { api } from "marku/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ElementPage: NextPage = () => {
  const router = useRouter();
  const { elementId, campaignId } = router.query;
  const deleteElementMutation = api.element.deleteElement.useMutation()

  const handleDelete = async () => {
    console.log('delete element')
    const res = await deleteElementMutation.mutateAsync({ elementId: elementId as string })
    console.log('res', res)
    if (res.status === 'success') {
      console.log("Yo here")
      void message.success('Element deleted successfully')
      void router.push(`/campaign/${campaignId as string}`)
    } else {
      void message.error('Error deleting element')
    }
  }

  return (
    <Template pageTitle="Element">
      <div>Welcome</div>

      <Button type="primary" danger onClick={void handleDelete}>Delete Element</Button>
    </Template>
  );
}

export default ElementPage;
