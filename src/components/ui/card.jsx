// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`relative rounded-lg shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
