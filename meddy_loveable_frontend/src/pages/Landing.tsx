import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="security">
          <TrustSection />
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;