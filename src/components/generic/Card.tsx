// CardComponent.tsx
import React from 'react';
import { Card } from 'antd';

interface CardComponentProps {
  imageUrl: string;
  topMiddleText: string;
  bottomLeftText: string;
}

const CardComponent: React.FC<CardComponentProps> = ({
  imageUrl,
  topMiddleText,
  bottomLeftText,
}) => {
  return (
    <Card
      className="relative w-full h-full overflow-hidden"
      cover={<img alt={topMiddleText} src={imageUrl} />}
    >
      <div className="absolute top-0 left-0 w-full flex justify-center">
        <span className="bg-white text-black px-2 py-1 text-sm">{topMiddleText}</span>
      </div>
      <div className="absolute bottom-0 left-0">
        <span className="bg-white text-black px-2 py-1 text-sm">{bottomLeftText}</span>
      </div>
    </Card>
  );
};

export default CardComponent;
