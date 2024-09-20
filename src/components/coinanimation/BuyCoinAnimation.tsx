'use client';
import React, { useEffect, useState } from 'react';
import useAnimationStore from '@/store/useAnimationStore'; // Import Zustand store

// Define the type for the coin position
interface CoinPosition {
  left: number;   // Left position in percentage
  duration: number; // Duration in seconds
}

interface CoinAnimationProps {
  trigger: boolean; // Prop to trigger the animation
  setTrigger: (value: boolean) => void; // Function to set the trigger value
}

const BuyCoinAnimation = () => {
  const [coins, setCoins] = useState<CoinPosition[]>([]);
  const {purchaseCompleteAnimation, setPurchaseCompleteAnimation} = useAnimationStore(); // Access Zustand state

  // Number of coins to drop
  const numberOfCoins = 80;

  // Function to generate evenly spaced left positions and durations
  const generateEvenlySpacedPositions = (): CoinPosition[] => {
    return Array.from({ length: numberOfCoins }).map((_, i) => ({
      left: 50 + (i - numberOfCoins / 2) * (100 / numberOfCoins), // Spread evenly around the center
      duration: Math.random() * 1.5 , // Random duration (0.9 to 2.4 seconds)
    }));
  };

  useEffect(() => {
    // Check if the animation has already run or the trigger is not set
    if (!purchaseCompleteAnimation) {
      return;
    }

    // Generate coin positions if animation hasn't run and trigger is true
    const newCoins = generateEvenlySpacedPositions();
    setCoins(newCoins);

    // Set a timeout to hide the component after the longest animation time (3 seconds)
    const timer = setTimeout(() => {
    //   setAnimationFinished(true); // Update Zustand state to indicate the animation has finished
    setPurchaseCompleteAnimation(false);
    }, 2400); // 3 seconds

    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
  }, [purchaseCompleteAnimation, setPurchaseCompleteAnimation]);

  // If the animation is finished, don't render the component
  if (purchaseCompleteAnimation === false) {
    return null;
  }

  return (
    <div className="coin-container">
      {coins.map((coin, index) => (
        <div
          key={index}
          className="buy-coin"
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

export default BuyCoinAnimation;
