import HeroSection from "@/components/HeroSection/HeroSection";
import TopNavBar from "@/components/navigation/TopNavBar";
import CoinAnimation from "@/components/coinanimation/coinanimation";
import AlertBox from "@/components/alertBox/AlertBox";
import MaintenanceModal from "@/components/MaintenanceModal"

export default function Home() {
  return(  <div className="flex flex-col w-full items-center">
    {/* <CoinAnimation /> */}
      <MaintenanceModal/>
      <TopNavBar />
      <HeroSection />
  </div>
);
}
