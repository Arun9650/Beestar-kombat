import LanguageSelector from '@/components/languageSelector';
import SectionBanner from '@/components/sectionBanner';

export default function HomePage() {
  return (
    <div className="">
        <SectionBanner
        mainText='Langauges'
        subText='Change settings according to yourself'
        leftIcon='/newImages/bee.png'
        rightIcon='/newImages/bee-right.png'
        />
      <LanguageSelector />
    </div>
  );
}
