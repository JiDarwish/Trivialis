import { Spin } from 'antd';
import { type FC } from 'react';


const Loading : FC= () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" />
    </div>
  );
}

export default Loading;
