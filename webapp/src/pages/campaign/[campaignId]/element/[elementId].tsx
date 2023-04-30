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
      message.success('Element deleted successfully')
      router.push(`/campaign/${campaignId as string}`)
    } else {
      message.error('Error deleting element')
    }
  }

  return (
    <Template pageTitle="Element">
      <div>Welcome</div>

      <Button type="primary" danger onClick={handleDelete}>Delete Element</Button>
    </Template>
  );
}

export default ElementPage;
