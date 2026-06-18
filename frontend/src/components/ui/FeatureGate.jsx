import React from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Lock, Sparkles } from 'lucide-react';

/**
 * Wrapper component that gates premium features.
 * Shows a locked overlay if the user doesn't have access.
 *
 * Usage:
 *   <FeatureGate feature="cover_letter" requirePro>
 *     <CoverLetterGenerator />
 *   </FeatureGate>
 */
const FeatureGate = ({
  children,
  requirePro = false,
  requireCredits = false,
  feature = 'premium',
  message = '',
  fallback = null,
}) => {
  const { isPro, canMakeAiRequest, promptUpgrade } = useSubscription();

  const isLocked =
    (requirePro && !isPro) ||
    (requireCredits && !canMakeAiRequest);

  if (!isLocked) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, use that
  if (fallback) {
    return <>{fallback}</>;
  }

  const defaultMessage = requireCredits
    ? 'You\'ve used all your AI credits this month. Upgrade to Pro for unlimited access.'
    : 'This is a premium feature. Upgrade to Pro to unlock it.';

  return (
    <div className="relative">
      {/* Blurred/dimmed content */}
      <div className="opacity-30 pointer-events-none select-none blur-[2px]">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <Lock className="w-5 h-5 text-neutral-500" />
          </div>
          <p className="text-sm font-semibold text-neutral-700 mb-1">
            {requirePro ? 'Pro Feature' : 'Credits Required'}
          </p>
          <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
            {message || defaultMessage}
          </p>
          <button
            type="button"
            onClick={() => promptUpgrade(message || defaultMessage, feature)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
