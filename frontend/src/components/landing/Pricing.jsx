import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Section, { SectionHeader } from './ui/Section';
import Button from './ui/Button';
import { pricingPlans } from '../../data/landingContent';

export default function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        label="Pricing"
        title="Free to start, Pro when you are applying"
        description="Straightforward plans. No annual lock-in required on Free."
      />
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
            whileHover={{ 
              y: -8, 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
              borderColor: '#171717'
            }}
            className={`rounded-lg border p-8 transition-colors duration-200 ${
              plan.highlighted
                ? 'border-neutral-900 ring-1 ring-neutral-900'
                : 'border-neutral-200'
            } bg-white`}
          >
            <h3 className="text-base font-semibold text-neutral-900">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-neutral-900 tracking-tight tabular-nums">
                {plan.price}
              </span>
              <span className="text-sm text-neutral-500">/{plan.period}</span>
            </div>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{plan.description}</p>
            <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="h-4 w-4 shrink-0 text-neutral-900 mt-0.5" strokeWidth={2} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              size="lg"
              to="/app"
              className="w-full mt-8"
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
