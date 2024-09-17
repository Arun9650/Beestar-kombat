'use client'
// components/CoinAnimation.js
import React, { useEffect, useState } from 'react';

const CoinAnimation = () => {
  const [coins, setCoins] = useState<Array<{ left: number; duration: number; }>>([]);

  // Number of coins to drop
  const numberOfCoins = 80;

 // Function to generate evenly spaced left positions
 const generateEvenlySpacedPositions = () => {
    // Calculate positions spaced around the center (50%)
    return Array.from({ length: numberOfCoins }).map((_, i) => ({
      left: 50 + (i - numberOfCoins / 2) * (100 / numberOfCoins), // Spread evenly around the center
      duration: Math.random() * 1.5 + 0.9, // Random duration (2 to 3 seconds)
    }));
  };

 
  useEffect(() => {
    // Generate evenly spaced positions for coins
    const newCoins = generateEvenlySpacedPositions();
    setCoins(newCoins);
  }, []);

  return (
    <div className="coin-container">
      {coins.map((coin, index) => (
        <div
          key={index}
          className="coin"
          style={{
            left: `${coin.left}%`, // Set the random left position
            animationDuration: `${coin.duration}s`, // Set random animation duration
            backgroundImage: `url('/newImages/dollar-coin.png')`, // Use the coin image as the background
          }}
        />
      ))}
    </div>
  );
};

export default CoinAnimation;
