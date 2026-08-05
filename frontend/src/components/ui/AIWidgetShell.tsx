import React from 'react';
import { Sparkles, Bot, AlertTriangle, RefreshCw, ArrowRight, CornerDownLeft, ShieldAlert } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '@/utils/cn';

export type AIWidgetState = 'answered' | 'loading' | 'unavailable';

export interface AIWidgetShellProps {
  state?: AIWidgetState;
  question?: string;
  answer?: string;
  modelName?: string;
  onAskQuestion?: (q: string) => void;
  onRetry?: () => void;
  className?: string;
}

export const AIWidgetShell: React.FC<AIWidgetShellProps> = ({
  state = 'answered',
  question = "What is our 30-day price trend prediction for 50mm GI Steel Pipes?",
  answer = "Based on market indicators, steel index momentum (+2.4%), and historical purchase costs, GI 50mm Pipe price is projected to rise by ₹1,450/ton (+2.8%) over the next 30 days.",
  modelName = "Price Prediction Model (v1.0)",
  onAskQuestion,
  onRetry,
  className
}) => {
  return (
    <Card variant="ai" className={cn("p-6 flex flex-col space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ai/15 border border-ai/30 flex items-center justify-center text-ai shadow-aiGlow">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
              Ask BizPilot AI
              <Badge variant="ai" size="sm">Copilot</Badge>
            </h4>
            <p className="text-[11px] text-text-secondary">
              Predictive Steel Market Intelligence & Analytics
            </p>
          </div>
        </div>

        {state === 'answered' && (
          <span className="text-[10px] font-mono text-ai bg-ai/10 border border-ai/20 px-2 py-0.5 rounded-full">
            {modelName}
          </span>
        )}
      </div>

      {/* Question Prompt Display */}
      {question && (
        <div className="bg-surface-elevated/60 border border-borderToken rounded-lg p-3 text-xs text-text-primary flex items-start gap-2">
          <Bot className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <span className="font-medium text-text-primary">{question}</span>
        </div>
      )}

      {/* Body States */}
      <div className="min-h-[100px] flex flex-col justify-center">
        {/* STATE 1: ANSWERED */}
        {state === 'answered' && (
          <div className="space-y-3">
            <p className="text-xs text-text-primary leading-relaxed bg-surface/80 p-3.5 rounded-lg border border-borderToken">
              {answer}
            </p>
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Confidence Score: <strong className="text-status-success font-semibold">92.4%</strong></span>
              <span>Updated: Just now</span>
            </div>
          </div>
        )}

        {/* STATE 2: LOADING (Typing / Shimmer Pulsing Animation) */}
        {state === 'loading' && (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-xs text-ai font-medium animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>BizPilot AI is running predictive neural models...</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-ai/20 rounded-full w-full animate-pulse" />
              <div className="h-3 bg-ai/15 rounded-full w-5/6 animate-pulse" />
              <div className="h-3 bg-ai/10 rounded-full w-3/4 animate-pulse" />
            </div>
          </div>
        )}

        {/* STATE 3: UNAVAILABLE (503 HTTP Contract - Milestone 4 Gated) */}
        {state === 'unavailable' && (
          <div className="bg-status-warning/5 border border-status-warning/30 rounded-xl p-4 flex flex-col space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-status-warning/10 border border-status-warning/30 flex items-center justify-center text-status-warning shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-bold text-text-primary">
                    AI Prediction Model Not Yet Available
                  </h5>
                  <Badge variant="warning" size="sm">HTTP 503</Badge>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Price prediction neural models are currently in training for this product SKU (Milestone 4). Zero fabricated values are returned.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-status-warning/15 text-[11px]">
              <span className="font-mono text-status-warning/80">Status: 503_MODEL_UNAVAILABLE</span>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  leftIcon={<RefreshCw className="w-3 h-3" />}
                  className="h-7 text-xs border-status-warning/30 hover:bg-status-warning/10"
                >
                  Check Model Status
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Input Footer */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem('prompt') as HTMLInputElement;
            if (input?.value) {
              onAskQuestion?.(input.value);
              input.value = '';
            }
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            name="prompt"
            placeholder="Ask AI about demand, pricing trends, or inventory..."
            className="w-full bg-surface border border-borderToken rounded-lg pl-3 pr-10 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-ai focus:ring-2 focus:ring-ai/20"
          />
          <button
            type="submit"
            className="absolute right-2 text-ai hover:text-white p-1 rounded-md transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Card>
  );
};
