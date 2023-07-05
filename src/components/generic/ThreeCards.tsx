// ParentComponent.tsx
import React from 'react';
import CardComponent from './Card';

const ThreeCards: React.FC = () => {
  const cards = [
    {
      imageUrl: 'desk.jpg',
      topMiddleText: '12-10-2023 12:00:00',
      bottomLeftText: 'Gaging the market',
    },
    {
      imageUrl: 'lamp.jpg',
      topMiddleText: '14-02-2024 13:30:00',
      bottomLeftText: 'Targeting specific demographics',
    },
    {
      imageUrl: 'laptop.jpg',
      topMiddleText: '09-04-2023 07:00:00',
      bottomLeftText: 'New product launch',
    },
  ];

  return (
    <div className="w-10/12 flex justify-center">
      <div className="w-full grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <CardComponent
            key={index}
            imageUrl={card.imageUrl}
            topMiddleText={card.topMiddleText}
            bottomLeftText={card.bottomLeftText}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreeCards;
