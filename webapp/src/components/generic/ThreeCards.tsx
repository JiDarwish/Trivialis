// ParentComponent.tsx
import React from 'react';
import CardComponent from './Card';

const ThreeCards: React.FC = () => {
  const cards = [
    {
      imageUrl: 'desk.jpg',
      topMiddleText: 'Marketing march',
      bottomLeftText: 'Gaging the market',
    },
    {
      imageUrl: 'lamp.jpg',
      topMiddleText: 'Shoes ar802-2',
      bottomLeftText: 'Targeting specific demographics',
    },
    {
      imageUrl: 'laptop.jpg',
      topMiddleText: 'Handbag sr-2203',
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
