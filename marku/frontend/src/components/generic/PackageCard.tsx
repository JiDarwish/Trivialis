import { EyeOutlined } from "@ant-design/icons"
import { Button, Card } from "antd"
import Link from "next/link"
import { useRouter } from "next/router"
import type { FC } from "react"

import type { PackageResponse } from "../../util/apiTypes"

const PackageCard: FC<{ packageItem: PackageResponse }> = ({ packageItem }) => {
  const router = useRouter();

  return (
    <Card
      title={packageItem.name}
      className="w-full font-dm-sans"
      extra={
        <Link href={`${router.asPath}/${packageItem.id}`}>
          <Button type="primary" icon={<EyeOutlined />} size="large" />
        </Link>
      }
    >
      <div className="flex justify-between">
        <div>Total price: € {Math.round(packageItem.total_price * 100) / 100}</div>
      </div>
    </Card>
  )
}

export default PackageCard
