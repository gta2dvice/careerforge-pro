import React from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Crown, Zap } from 'lucide-react';

/**
 * Inline plan badge showing current plan and credits.
 * Displays in the header bar of the resume builder.
 */
const PlanBadge = ({ compact = false }) => {
  const {
    isPro,
    currentPlan,
    aiCredits,
    isLoadingPlan,
    promptUpgrade,
  } = useSubscription();

  if (isLoadingPlan) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg animate-pulse">
        <div className="w-3 h-3 bg-neutral-300 rounded-full" />
        <div className="w-12 h-3 bg-neutral-300 rounded" />
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
        <Crown className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          Pro
        </span>
      </div>
    );
  }

  // Free plan badge with credits indicator
  return (
    <button
      type="button"
      onClick={() => promptUpgrade(
        'Upgrade to Pro for unlimited AI credits and premium features.',
        'ai_credits'
      )}
      className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 group cursor-pointer"
      title="Click to upgrade"
    >
      <Zap className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-500 transition-colors" />
      {!compact && (
        <span className="text-xs font-semibold text-neutral-600">
          Free
        </span>
      )}
      {aiCredits !== null && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
          aiCredits > 2
            ? 'bg-emerald-100 text-emerald-700'
            : aiCredits > 0
            ? 'bg-amber-100 text-amber-700'
            : 'bg-rose-100 text-rose-700'
        }`}>
          {aiCredits} credit{aiCredits !== 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
};

export default PlanBadge;
