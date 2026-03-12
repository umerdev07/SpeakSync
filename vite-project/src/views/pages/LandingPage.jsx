import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import GlobalStyles        from "../components/LandingPage/GlobalStyles";
import Navbar              from "../components/LandingPage/Navbar";
import HeroSection         from "../components/LandingPage/HeroSection";
import Ticker              from "../components/LandingPage/Ticker";
import FeaturesSection     from "../components/LandingPage/FeaturesSection";
import StatsSection        from "../components/LandingPage/StatsSection";
import HowItWorksSection   from "../components/LandingPage/HowItWorksSection";
import TechSection         from "../components/LandingPage/TechSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import PricingSection      from "../components/LandingPage/PricingSection";
import CTASection          from "../components/LandingPage/CTASection";
import Footer              from "../components/LandingPage/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <GlobalStyles />
      <Navbar onLogin={() => navigate('/login')} />
      <main>
        <HeroSection         onLogin={() => setShowLogin(true)} />
        <Ticker />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TechSection />
        <TestimonialsSection />
        <PricingSection      onLogin={() => setShowLogin(true)} />
        <CTASection          onLogin={() => navigate('/login')} />
      </main>
      <Footer />

      {/* Login modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-lg flex items-center justify-center"
          onClick={() => setShowLogin(false)}>
          <div
            className="bg-darkCard border border-border rounded-2xl p-9 max-w-[380px] w-[90%]"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,.8)" }}
            onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-[22px] font-extrabold text-textPrim mb-2">
              Sign In to SpeakSync
            </h2>
            <p className="font-body text-sm text-textSec mb-6">
              Navigate to <code className="text-accent">/login</code> in your app to use the full Login page.
            </p>
            <button
              className="btn-primary w-full py-3 text-[15px] rounded-lg"
              onClick={() => setShowLogin(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}