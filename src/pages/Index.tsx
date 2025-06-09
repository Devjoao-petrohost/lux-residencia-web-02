
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import KeyFeatures from '@/components/KeyFeatures';
import AboutSection from '@/components/AboutSection';
import FeaturedAccommodations from '@/components/FeaturedAccommodations';
import SecaoDepoimentos from '@/components/SecaoDepoimentos';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="pagina-inicial min-h-screen">
      <Header />
      <Hero />
      <KeyFeatures />
      <AboutSection />
      <FeaturedAccommodations />
      <SecaoDepoimentos />
      <Footer />
    </div>
  );
};

export default Index;
