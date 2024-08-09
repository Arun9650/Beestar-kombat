"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { beeAvatar, binanceLogo, dollarCoin } from "../../public/newImages";
import Info from "../../public/icons/Info";
import Settings from "../../public/icons/Settings";
import { useRouter } from "next/navigation";
import { usePointsStore } from "@/store/PointsStore";
import useExchangeStore from "@/store/useExchangeStore";
import Link from "next/link";
const Header = () => {
  

  return (
    <div className="w-full px-4 ">
      <div className="w-full  ">
        
      </div>
    </div>
  );
};

export default Header;
