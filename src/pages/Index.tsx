
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import DashboardPreview from '@/components/DashboardPreview';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Pricing />
      <ContactSection />
      <Footer />
      <ChatBot userType="patient" userName="Guest" />
    </div>
  );
};

export default Index;
