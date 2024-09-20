import Image from 'next/image';
import React from 'react';

interface SectionBannerProps {
  mainText: string;
  subText: string;
  leftIcon?: string;
  rightIcon?: string;
}

const SectionBanner: React.FC<SectionBannerProps> = ({
  mainText,
  subText,
  leftIcon,
  rightIcon,
}) => {
  return (
    <div className="flex flex-col items-center mb-4 relative w-full">
       {leftIcon &&  <Image
          src="/newImages/bee.png"
          alt="bee"
          width={50}
          height={50}
          className="absolute -left-5 -top-5"
        />}
        <h1 className="text-3xl font-bold text-custom-orange ">
        {mainText}
        </h1>
        <p className="text-[0.625rem]">{subText}</p>
       {rightIcon && <Image
          src="/newImages/bee-right.png"
          alt="bee"
          width={40}
          height={40}
          className="absolute right-0  max-w-[400px]:-right-8 -top-5"
        />}
      </div>
  );
};

export default SectionBanner;
