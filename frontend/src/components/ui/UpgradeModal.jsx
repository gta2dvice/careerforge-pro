import React from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';
import { X, Sparkles, Crown, Zap, Shield, ArrowRight } from 'lucide-react';

/**
 * Premium upgrade modal displayed when a user hits plan limits.
 * Shows the reason they can't proceed and highlights Pro benefits.
 */
const UpgradeModal = () => {
  const {
    showUpgradeModal,
    upgradeReason,
    upgradeFeature,
    dismissUpgrade,
    triggerUpgrade,
    currentPlan,
    aiCredits,
  } = useSubscription();

  if (!showUpgradeModal) return null;

  const featureLabels = {
    premium: 'Premium Feature',
    ai_credits: 'AI Credits Exhausted',
    cover_letter: 'Cover Letter Generation',
    advanced_ai: 'Advanced AI Features',
    custom_templates: 'Custom Templates',
  };

  const benefits = [
    { icon: Zap, label: 'Unlimited AI credits', desc: 'No more monthly limits' },
    { icon: Crown, label: 'Advanced AI features', desc: 'Cover letters, PDF transforms & more' },
    { icon: Shield, label: 'Priority support', desc: 'Get help when you need it' },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={dismissUpgrade}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'upgradeModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-6 pt-6 pb-8 text-white overflow-hidden">
          {/* Decorative sparkle orbs */}
          <div className="absolute top-3 right-16 w-20 h-20 rounded-full bg-amber-400/10 blur-xl" />
          <div className="absolute bottom-0 left-8 w-16 h-16 rounded-full bg-indigo-500/10 blur-xl" />

          <button
            onClick={dismissUpgrade}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-400/20 rounded-lg">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {featureLabels[upgradeFeature] || 'Pro Feature'}
            </span>
          </div>

          <h2 className="text-xl font-bold leading-tight mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {upgradeReason || 'Unlock unlimited AI optimizations and premium features to supercharge your job search.'}
          </p>

          {aiCredits !== null && currentPlan === 'free' && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 border border-rose-400/30 rounded-lg text-xs font-semibold text-rose-300">
              <Zap className="w-3.5 h-3.5" />
              {aiCredits} credit{aiCredits !== 1 ? 's' : ''} remaining this month
            </div>
          )}
        </div>

        {/* Benefits list */}
        <div className="px-6 py-5 space-y-3">
          {benefits.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="p-1.5 bg-neutral-100 rounded-lg shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-neutral-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{label}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-2.5">
          <button
            onClick={async () => {
              try {
                await triggerUpgrade();
              } catch {
                // Fallback: navigate to pricing page
                window.location.href = '/pricing';
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Pro — ₹299/mo
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/pricing"
            onClick={dismissUpgrade}
            className="block w-full text-center py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Compare all plans →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes upgradeModalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UpgradeModal;
