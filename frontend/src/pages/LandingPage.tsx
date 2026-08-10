import React, { lazy, Suspense } from 'react';
import { Navbar } from '../sections/landing/Navbar';
import { Hero } from '../sections/landing/Hero';
import { Footer } from '../sections/landing/Footer';

// Section Fallback Skeleton
const SectionSkeleton: React.FC = () => (
  <div className="w-full py-24 bg-[#050505] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#CF9EFF]/30 border-t-[#CF9EFF] rounded-full animate-spin" />
  </div>
);

// Lazy Loaded Landing Page Sections (Below-the-fold optimization)
const DataUniverse = lazy(() => import('../sections/landing/DataUniverse').then(m => ({ default: m.DataUniverse })));
const AIExecutiveTeam = lazy(() => import('../sections/landing/AIExecutiveTeam').then(m => ({ default: m.AIExecutiveTeam })));
const CustomerIntelligence = lazy(() => import('../sections/landing/CustomerIntelligence').then(m => ({ default: m.CustomerIntelligence })));
const ProfitIntelligence = lazy(() => import('../sections/landing/ProfitIntelligence').then(m => ({ default: m.ProfitIntelligence })));
const CashflowIntelligence = lazy(() => import('../sections/landing/CashflowIntelligence').then(m => ({ default: m.CashflowIntelligence })));
const PredictiveIntelligence = lazy(() => import('../sections/landing/PredictiveIntelligence').then(m => ({ default: m.PredictiveIntelligence })));
const AIBusinessAnalyst = lazy(() => import('../sections/landing/AIBusinessAnalyst').then(m => ({ default: m.AIBusinessAnalyst })));
const AskYourBusiness = lazy(() => import('../sections/landing/AskYourBusiness').then(m => ({ default: m.AskYourBusiness })));
const CompanyKnowledge = lazy(() => import('../sections/landing/CompanyKnowledge').then(m => ({ default: m.CompanyKnowledge })));
const ProductShowcase = lazy(() => import('../sections/landing/ProductShowcase').then(m => ({ default: m.ProductShowcase })));
const IndiaFirst = lazy(() => import('../sections/landing/IndiaFirst').then(m => ({ default: m.IndiaFirst })));
const Security = lazy(() => import('../sections/landing/Security').then(m => ({ default: m.Security })));
const FinalCTA = lazy(() => import('../sections/landing/FinalCTA').then(m => ({ default: m.FinalCTA })));

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />
      <main>
        {/* Above-the-fold rendered immediately */}
        <Hero />

        {/* Below-the-fold heavy sections lazy loaded with Suspense */}
        <Suspense fallback={<SectionSkeleton />}>
          <DataUniverse />
          <AIExecutiveTeam />
          <CustomerIntelligence />
          <ProfitIntelligence />
          <CashflowIntelligence />
          <PredictiveIntelligence />
          <AIBusinessAnalyst />
          <AskYourBusiness />
          <CompanyKnowledge />
          <ProductShowcase />
          <IndiaFirst />
          <Security />
          <FinalCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

