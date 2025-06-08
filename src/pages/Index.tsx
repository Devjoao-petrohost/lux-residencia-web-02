
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FeaturedAccommodations from '@/components/FeaturedAccommodations';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <FeaturedAccommodations />
      <Footer />
    </div>
  );
};

export default Index;
