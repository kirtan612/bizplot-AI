import React from 'react';
import { Sparkles, Bot, ShieldAlert } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const AIInsightsPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold uppercase">
          AI PREDICTIVE TELEMETRY (ai.insights.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Predictive AI Business Analyst
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          120-day forward profit forecasts, customer churn signals, and automated executive directives.
        </p>
      </div>

      <BusinessChart
        title="120-Day Forward Profit Trajectory Forecast"
        subtitle="Solid line = Historical | Dashed line = AI Prediction Model"
        data={[
          { label: 'Jun (Actual)', value: 3.42, isForecast: false },
          { label: 'Jul (Actual)', value: 3.38, isForecast: false },
          { label: 'Aug (Forecast)', value: 3.31, isForecast: true },
          { label: 'Sep (Forecast)', value: 3.20, isForecast: true },
          { label: 'Oct (Forecast)', value: 3.12, isForecast: true },
        ]}
        type="forecast"
        colorTheme="forecast"
        height={220}
        prefix="₹"
        suffix=" Cr"
      />
    </div>
  );
};
