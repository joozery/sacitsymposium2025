import AboutHeader from './About/components/AboutHeader';
import AboutContent from './About/components/AboutContent';
import VisionSection from './About/components/VisionSection';
import MissionSection from './About/components/MissionSection';
import ValuesSection from './About/components/ValuesSection';
import BannerSection from './About/components/BannerSection';

const About = () => {
  return (
    <div className="min-h-screen">
      <AboutHeader />
      <AboutContent />
      <VisionSection />
      <MissionSection />
      <ValuesSection />
      <BannerSection />
    </div>
  );
};

export default About; 