import { Button, Card, message } from "antd"
import type { FC } from "react"
import dayjs from "dayjs"

import type { PlanResponseType } from "../../util/apiTypes"
import { deletePlan } from "../../util/api/apiCalls"
import Link from "next/link"
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, EyeFilled } from "@ant-design/icons"

const PlanCard: FC<{ plan: PlanResponseType, onPlanDelete: () => void }> = ({ plan, onPlanDelete }) => {
  const handleDeletePlan = async () => {
    const response = await deletePlan(`${plan.id}`)
    if (response.error) {
      message.error(response.error)
      return
    }
    onPlanDelete()
    message.success("Plan deleted")
  }
  return (
    <Card
      title={plan.name}
      className="w-full font-dm-sans"
      extra={
        <>
          <Link href={`/plans/${plan.id}/packages`}>
            <Button type="primary" icon={<EyeFilled />} className="mr-3" />
          </Link>
          <Link href={`/plans/${plan.id}`}>
            <Button type="primary" icon={<EditFilled />} className="mr-3" />
          </Link>
          <Button danger type="primary" icon={<DeleteFilled />} onClick={handleDeletePlan} />
        </>
      }
    >
      <div className="text-sm">Created: {dayjs(plan.created_at).format("DD-MM-YYYY")}</div>
    </Card>
  )
}

export default PlanCard
