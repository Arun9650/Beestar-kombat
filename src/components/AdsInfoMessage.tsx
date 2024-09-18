import React from 'react';

// Helper function to calculate total potential earnings
const calculateMaxEarnings = (adsLimit: number, baseReward: number) => {
  // Formula for sum of first n natural numbers: n * (n + 1) / 2
  const totalEarnings = (adsLimit * (adsLimit + 1)) / 2 * baseReward;
  return totalEarnings;
};

const AdInfoMessage: React.FC = () => {
  const adsLimit = 20; // Max ads a user can watch per day
  const baseReward = 5000; // Base reward per ad

  // Calculate total earnings for the day (20 ads with incremental rewards)
  const maxEarnings = calculateMaxEarnings(adsLimit, baseReward);

  return (
    <div className="px-3 py-2 bg-[#1d2025]  rounded-lg text-white text-center text-[0.5rem]">
      <h3 className="text-lg font-semibold">How Ads and Rewards Work</h3>
      <p className="mt-2">
        You can earn rewards by watching ads. Each ad you watch increases your reward by 5000 points.
      </p>
      <p className="mt-2">For example:</p>
      <ul className="list-disc list-inside start-0">
        <li>1st Ad: 5000 Points</li>
        <li>2nd Ad: 10000 Points</li>
        <li>3rd Ad: 15000 Points</li>
        <li>... and so on up to {maxEarnings.toLocaleString()} Points</li>
      </ul>
      <p className="mt-2">
      Watch up to 20 ads per day and earn more with each ad!
      </p>
    </div>
  );
};

export default AdInfoMessage;
