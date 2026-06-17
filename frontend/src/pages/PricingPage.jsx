import { Check, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../data/landingContent';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
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
                      <Sparkles className="h-3.5 w-3.5" />
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

                <Link
                  to="/app"
                  className={`block w-full py-3.5 px-6 rounded-lg font-semibold text-center transition-all mb-8 ${
                    plan.highlighted
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg'
                      : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  {plan.cta}
                </Link>

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
