import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Warehouse,
  Settings,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
  Bot,
  Globe
} from 'lucide-react';

export default function CreateCompanyWizard({ onWizardComplete }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State with prefilled default realistic values
  const [companyDetails, setCompanyDetails] = useState({
    companyName: 'Apex Industrial Solutions Pvt Ltd',
    gstNumber: '27AAACA1234B1Z5',
    businessType: 'Private Limited (MSME)',
    industry: 'Manufacturing & Distribution',
    annualTurnover: '$1M - $5M ARR',
    employeeCount: '51 - 200 Employees'
  });

  const [warehouseInfo, setWarehouseInfo] = useState({
    mainWarehouseName: 'Main Yard (Mumbai Port)',
    primaryLocation: 'Jawaharlal Nehru Port, Mumbai',
    multiWarehouse: true,
    additionalLocations: 'Stockyard B (Taloja Industrial), North Hub (Delhi NCR)'
  });

  const [businessPreferences, setBusinessPreferences] = useState({
    financialYear: 'April 1 - March 31 (Standard FY)',
    currency: 'INR (₹) / USD ($) Dual Currency',
    timezone: 'Asia/Kolkata (GMT+05:30)',
    gstEnabled: true,
    aiAutonomousAlerts: true
  });

  const [teamMembers, setTeamMembers] = useState([
    { email: 'ananya@apexindustrial.com', role: 'Manager' },
    { email: 'vikram@apexindustrial.com', role: 'Staff' }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Manager');

  const [isCalibrating, setIsCalibrating] = useState(false);

  const addMember = () => {
    if (newEmail) {
      setTeamMembers([...teamMembers, { email: newEmail, role: newRole }]);
      setNewEmail('');
    }
  };

  const removeMember = (idx) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      if (currentStep === 4) {
        setIsCalibrating(true);
        setTimeout(() => setIsCalibrating(false), 1200);
      }
      setCurrentStep(currentStep + 1);
    } else {
      onWizardComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    { num: 1, label: 'Company Details', icon: Building2 },
    { num: 2, label: 'Warehouse Setup', icon: Warehouse },
    { num: 3, label: 'Preferences', icon: Settings },
    { num: 4, label: 'Invite Team', icon: Users },
    { num: 5, label: 'Launch OS', icon: CheckCircle2 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Wizard Header & Progress Bar */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
            ENTERPRISE ONBOARDING WIZARD
          </span>
          <h2 className="text-3xl font-bold text-white font-sans mt-3">
            Initialize Your AI Operating System
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure company parameters, warehouse routes, and executive preferences.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-zinc-800 -z-0" />
          {stepTitles.map((st) => {
            const IconComponent = st.icon;
            const isDone = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div key={st.num} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-blue-400'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <IconComponent className="w-4 h-4" />}
                </div>
                <span className={`text-[11px] font-medium mt-2 hidden sm:block ${isCurrent ? 'text-blue-400 font-semibold' : 'text-zinc-500'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-[#121215] border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* STEP 1: Company Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Step 1: Company Details</h3>
                <p className="text-xs text-zinc-400">Legal entity registration and business profile.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-300">Registered Company Name</label>
                  <input
                    type="text"
                    value={companyDetails.companyName}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">GST Registration Number</label>
                  <input
                    type="text"
                    value={companyDetails.gstNumber}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, gstNumber: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Entity Type</label>
                  <select
                    value={companyDetails.businessType}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, businessType: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Private Limited (MSME)">Private Limited (MSME)</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership Firm">Partnership Firm</option>
                    <option value="LLP (Limited Liability Partnership)">LLP (Limited Liability Partnership)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Primary Industry Sector</label>
                  <select
                    value={companyDetails.industry}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Manufacturing & Distribution">Manufacturing & Distribution</option>
                    <option value="Retail & Multi-Store Commerce">Retail & Multi-Store Commerce</option>
                    <option value="Heavy Industry & Steel Construction">Heavy Industry & Steel Construction</option>
                    <option value="Pharmaceutical & Chemicals">Pharmaceutical & Chemicals</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Annual Turnover Range</label>
                  <select
                    value={companyDetails.annualTurnover}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, annualTurnover: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Under $500k ARR">Under $500k ARR</option>
                    <option value="$500k - $1M ARR">$500k - $1M ARR</option>
                    <option value="$1M - $5M ARR">$1M - $5M ARR</option>
                    <option value="$5M - $20M ARR">$5M - $20M ARR</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Warehouse Setup */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Step 2: Warehouse & Fulfillment</h3>
                <p className="text-xs text-zinc-400">Specify primary inventory stockyards and shipping hubs.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Main Warehouse Name</label>
                  <input
                    type="text"
                    value={warehouseInfo.mainWarehouseName}
                    onChange={(e) => setWarehouseInfo({ ...warehouseInfo, mainWarehouseName: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Primary Shipping Port / Location</label>
                  <input
                    type="text"
                    value={warehouseInfo.primaryLocation}
                    onChange={(e) => setWarehouseInfo({ ...warehouseInfo, primaryLocation: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-white">Multi-Warehouse Network Routing</h5>
                    <p className="text-[11px] text-zinc-400">Enable automated stock balancing across satellite yards.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={warehouseInfo.multiWarehouse}
                    onChange={(e) => setWarehouseInfo({ ...warehouseInfo, multiWarehouse: e.target.checked })}
                    className="w-5 h-5 rounded bg-[#0d0d0f] border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Business Preferences */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">Step 3: Financial & System Preferences</h3>
                <p className="text-xs text-zinc-400">Configure ledger reporting cycles and currency metrics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Financial Reporting Year</label>
                  <select
                    value={businessPreferences.financialYear}
                    onChange={(e) => setBusinessPreferences({ ...businessPreferences, financialYear: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="April 1 - March 31 (Standard FY)">April 1 - March 31 (Standard FY)</option>
                    <option value="January 1 - December 31 (Calendar)">January 1 - December 31 (Calendar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Primary Operating Currency</label>
                  <select
                    value={businessPreferences.currency}
                    onChange={(e) => setBusinessPreferences({ ...businessPreferences, currency: e.target.value })}
                    className="w-full h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="INR (₹) / USD ($) Dual Currency">INR (₹) / USD ($) Dual Currency</option>
                    <option value="USD ($) Only">USD ($) Only</option>
                    <option value="EUR (€) Only">EUR (€) Only</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Invite Team */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Step 4: Invite Team Members</h3>
                  <p className="text-xs text-zinc-400">Add operational managers and staff (Optional).</p>
                </div>
                <span className="text-xs text-zinc-500 font-mono">OPTIONAL // CAN SKIP</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="flex-1 h-12 px-4 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="h-12 px-3 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white outline-none"
                >
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                </select>
                <button
                  type="button"
                  onClick={addMember}
                  className="h-12 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Team list */}
              <div className="space-y-2 pt-2">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900 border border-white/[0.08] rounded-xl flex items-center justify-between text-xs">
                    <span className="text-zinc-200 font-mono">{m.email}</span>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] uppercase">
                        {m.role}
                      </span>
                      <button onClick={() => removeMember(idx)} className="text-zinc-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Completion & Launch */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-sans">
                  Company Environment Ready!
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2">
                  <span className="text-white font-semibold">{companyDetails.companyName}</span> is initialized. Your AI C-Suite agents have calibrated financial stress tests and stockout triggers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 max-w-md mx-auto text-left space-y-2.5 font-mono text-xs">
                <div className="text-emerald-400 flex items-center gap-2">
                  <Bot className="w-4 h-4" /> AI CEO: Strategic advisory playbook loaded.
                </div>
                <div className="text-blue-400 flex items-center gap-2">
                  <Bot className="w-4 h-4" /> AI CFO: PostgreSQL ledger synced (90-day cashflow).
                </div>
                <div className="text-purple-400 flex items-center gap-2">
                  <Bot className="w-4 h-4" /> AI COO: Warehouse node connected: {warehouseInfo.mainWarehouseName}.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="h-12 px-6 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="h-12 px-8 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] flex items-center gap-2 cursor-pointer ml-auto"
          >
            <span>{currentStep === 5 ? 'Launch Business Command Center' : currentStep === 4 ? 'Complete Onboarding' : 'Continue Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
