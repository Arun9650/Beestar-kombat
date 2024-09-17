'use client';
import React, { useEffect, useState } from 'react';
import useAnimationStore from '@/store/useAnimationStore'; // Import Zustand store


// Define the type for the coin position
interface CoinPosition {
  left: number;   // Left position in percentage
  duration: number; // Duration in seconds
}

const CoinAnimation: React.FC = () => {
  const [coins, setCoins] = useState<CoinPosition[]>([]);
  const animationFinished = useAnimationStore((state) => state.animationFinished); // Access Zustand state
  console.log("🚀 ~ animationFinished:", animationFinished)
  const setAnimationFinished = useAnimationStore((state) => state.setAnimationFinished); // Access Zustand action
  console.log("🚀 ~ setAnimationFinished:", setAnimationFinished)

  // Number of coins to drop
  const numberOfCoins = 80;

  // Function to generate evenly spaced left positions and durations
  const generateEvenlySpacedPositions = (): CoinPosition[] => {
    return Array.from({ length: numberOfCoins }).map((_, i) => ({
      left: 50 + (i - numberOfCoins / 2) * (100 / numberOfCoins), // Spread evenly around the center
      duration: Math.random() * 1.5 + 0.9, // Random duration (0.9 to 2.4 seconds)
    }));
  };

  useEffect(() => {
    // Check if the animation has already run
    if (animationFinished) {
      return;
    }

    // Generate coin positions if animation hasn't run
    const newCoins = generateEvenlySpacedPositions();
    setCoins(newCoins);

    // Set a timeout to hide the component after the longest animation time (3 seconds)
    const timer = setTimeout(() => {
      setAnimationFinished(true); // Update Zustand state to indicate the animation has finished
    }, 2400); // 3 seconds

    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
  }, [animationFinished, setAnimationFinished]);

  // If the animation is finished, don't render the component
  if (animationFinished) {
    return null;
  }

  return (
    <div className="coin-container">
      {coins.map((coin, index) => (
        <div
          key={index}
          className="coin"
          style={{
            left: `${coin.left}%`, // Set the evenly spaced left position
            animationDuration: `${coin.duration}s`, // Set random duration between 0.9 to 2.4 seconds
            backgroundImage: `url('/newImages/dollar-coin.png')`, // Use the coin image as the background
          }}
        />
      ))}
    </div>
  );
};

export default CoinAnimation;
