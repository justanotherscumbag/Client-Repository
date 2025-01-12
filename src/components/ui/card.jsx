// components/ui/card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'default',
  isFlipped = false,
  isDisabled = false
}) => {
  const baseStyles = "relative rounded-lg shadow-md transition-all duration-300";
  const typeStyles = {
    default: "border border-cyan-500",
    upgrade: "border-2 border-pink-500",
    joker: "border-2 border-yellow-500"
  };

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${typeStyles[type]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isFlipped ? 'rotate-y-180' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      <div className={`w-full h-full ${isFlipped ? 'hidden' : 'block'}`}>
        {children}
      </div>
      {isFlipped && (
        <div className="absolute inset-0 rotate-y-180 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="transform rotate-y-180">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Variations of the card for different uses
export const PlayerCard = ({ card, onClick, isSelected, isDisabled }) => (
  <Card
    type={card.type}
    onClick={onClick}
    isDisabled={isDisabled}
    className={`
      w-24 h-32 transform transition-transform
      ${isSelected ? '-translate-y-4' : 'hover:-translate-y-2'}
    `}
  >
    <div className="h-full flex items-center justify-center text-cyan-400">
      {card.name}
    </div>
  </Card>
);

export const PlayedCard = ({ card, isFlipped }) => (
  <Card
    type={card?.type}
    isFlipped={isFlipped}
    className="w-32 h-48"
  >
    <div className="h-full flex items-center justify-center text-cyan-400">
      {card?.name}
    </div>
  </Card>
);

export default Card;