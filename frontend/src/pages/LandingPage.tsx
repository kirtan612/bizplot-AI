import React from 'react';
import { Navbar } from '../sections/landing/Navbar';
import { Hero } from '../sections/landing/Hero';
import { DataUniverse } from '../sections/landing/DataUniverse';
import { AIExecutiveTeam } from '../sections/landing/AIExecutiveTeam';
import { CustomerIntelligence } from '../sections/landing/CustomerIntelligence';
import { ProfitIntelligence } from '../sections/landing/ProfitIntelligence';
import { CashflowIntelligence } from '../sections/landing/CashflowIntelligence';
import { PredictiveIntelligence } from '../sections/landing/PredictiveIntelligence';
import { AIBusinessAnalyst } from '../sections/landing/AIBusinessAnalyst';
import { AskYourBusiness } from '../sections/landing/AskYourBusiness';
import { CompanyKnowledge } from '../sections/landing/CompanyKnowledge';
import { ProductShowcase } from '../sections/landing/ProductShowcase';
import { IndiaFirst } from '../sections/landing/IndiaFirst';
import { Security } from '../sections/landing/Security';
import { FinalCTA } from '../sections/landing/FinalCTA';
import { Footer } from '../sections/landing/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
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
      </main>
      <Footer />
    </div>
  );
};
