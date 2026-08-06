import React, { useEffect } from 'react';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustedBy from './components/TrustedBy';
import BusinessProblems from './components/BusinessProblems';
import SolutionWorkflow from './components/SolutionWorkflow';
import CoreModules from './components/CoreModules';
import HowItWorks from './components/HowItWorks';
import AITeam from './components/AITeam';
import DashboardPreview from './components/DashboardPreview';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function LandingPage({ onNavigateToApp }) {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleScrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* 1. Sticky Navigation Header */}
      <Navbar onNavigateToApp={onNavigateToApp} />

      <main>
        {/* 2. Hero Section */}
        <HeroSection
          onGetStarted={onNavigateToApp}
          onWatchDemo={() => handleScrollToSection('#dashboard-preview')}
        />

        {/* 3. Trusted By Enterprise Marquee */}
        <TrustedBy />

        {/* 4. Business Problems & Friction Points */}
        <BusinessProblems />

        {/* 5. Autonomous Solution Workflow */}
        <SolutionWorkflow onGetStarted={onNavigateToApp} />

        {/* 6. Core AI Intelligence Modules */}
        <CoreModules onGetStarted={onNavigateToApp} />

        {/* 7. How It Works Pipeline */}
        <HowItWorks onGetStarted={onNavigateToApp} />

        {/* 8. AI C-Suite Executive Team */}
        <AITeam onGetStarted={onNavigateToApp} />

        {/* 9. Interactive Dashboard Preview */}
        <DashboardPreview onGetStarted={onNavigateToApp} />

        {/* 10. Customer Testimonials & ROI */}
        <Testimonials />

        {/* 11. Transparent Pricing Tiers */}
        <Pricing onGetStarted={onNavigateToApp} />

        {/* 12. FAQ Accordion */}
        <FAQ />
      </main>

      {/* 13. Matte Black Enterprise Footer */}
      <Footer onGetStarted={onNavigateToApp} />
    </div>
  );
}
