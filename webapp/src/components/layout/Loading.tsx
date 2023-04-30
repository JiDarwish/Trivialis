import { Spin } from 'antd';
import { type FC } from 'react';


const Loading: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin tip="Loading..." />
    </div>
  );
}

export default Loading;
