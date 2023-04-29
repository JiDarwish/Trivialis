import type { FC } from "react";
import type { Transport } from "../../util/apiTypes";
import { Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import Link from "next/link";

const TransportItem: FC<{ transportItem: Transport }> = ({ transportItem }) => {
  return (
    <div className=" flex justify-between items-center">
      <div className="text-md md:max-2xl:text-xl">{transportItem.name}</div>
      <div className="flex items-center">
      <div className="text-sm md:max-2xl:text-xl pr-3">€ {transportItem.price}</div>
      <Link href={`${transportItem.link}`}>
        <Button type="primary" icon={<LinkOutlined />} size="middle" />
      </Link>
</div>
    </div>
  );
};

export default TransportItem;
