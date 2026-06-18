import { useState } from 'react';
import { Check, ArrowLeft, Sparkles, Loader2, Crown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../data/landingContent';
import { apiClient } from '../api/client';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleUpgrade = async (planName) => {
    if (planName === 'Free') {
      // Free plan — just go to the app
      window.location.href = '/app';
      return;
    }

    setIsLoading(true);
    setLoadingPlan(planName);

    try {
      const response = await apiClient.post('/api/payments/create-checkout-session');

      if (response.data?.success && response.data.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.data.url;
      } else {
        showToast(response.data?.message || 'Failed to create checkout session');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';

      if (err.response?.status === 401) {
        showToast('Please log in first to upgrade your plan');
      } else if (err.response?.status === 400) {
        showToast(message); // e.g. "You already have an active Pro subscription"
      } else if (err.response?.status === 503) {
        showToast('Payment system is not configured yet. Please try again later.');
      } else {
        showToast(message);
      }
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[9999] max-w-md w-full px-4"
          >
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              to="/app"
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight mb-6">
              Choose Your Plan
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
              Start free and upgrade when you need unlimited AI-powered resume optimization
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 p-8 bg-white shadow-lg ${
                  plan.highlighted
                    ? 'border-neutral-900 ring-4 ring-neutral-900/10'
                    : 'border-neutral-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-semibold">
                      <Crown className="h-3.5 w-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-5xl font-bold text-neutral-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-lg text-neutral-500">/{plan.period}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isLoading}
                  className={`block w-full py-3.5 px-6 rounded-lg font-semibold text-center transition-all mb-8 ${
                    plan.highlighted
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg disabled:bg-neutral-400'
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400'
                  }`}
                >
                  {isLoading && loadingPlan === plan.name ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting to Stripe...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check 
                          className={`h-5 w-5 shrink-0 mt-0.5 ${
                            plan.highlighted ? 'text-neutral-900' : 'text-neutral-600'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span className="text-neutral-700 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-neutral-200">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: 'What are AI credits?',
                a: 'AI credits are used for AI-powered features like job description analysis, resume optimization, and bullet rewriting. Free users get 5 credits per month, while Pro users get unlimited credits.',
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can upgrade to Pro at any time. If you downgrade, you\'ll retain Pro features until the end of your billing period.',
              },
              {
                q: 'What happens when I run out of credits?',
                a: 'Free users who run out of credits can either wait for the monthly reset or upgrade to Pro for unlimited access. Your resumes and data are always accessible.',
              },
              {
                q: 'Is my payment secure?',
                a: 'Absolutely. All payments are processed securely through Stripe, a PCI Level 1 certified payment processor. We never store your card details.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'We offer a 7-day money-back guarantee. If you\'re not satisfied with Pro, contact us within 7 days for a full refund.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-neutral-200 rounded-lg p-6 bg-white"
              >
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have landed their dream jobs with CareerForge Pro
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-100 transition-colors shadow-lg"
          >
            Start Building for Free
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
