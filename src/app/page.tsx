import HeroSection from "@/components/HeroSection/HeroSection";
import TopNavBar from "@/components/navigation/TopNavBar";

export default function Home() {
  return(<div className="flex flex-col w-full items-center ">
      <TopNavBar/>  
  <HeroSection />
  </div>
);
}
