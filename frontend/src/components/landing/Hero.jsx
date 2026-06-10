import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { HeroProductMockup } from './mockups/ProductMockup';
import { hero } from '../../data/landingContent';

export default function Hero() {
  return (
    <section className="pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="text-sm font-medium text-neutral-500 mb-5"
          >
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-[2rem] md:text-5xl font-semibold text-neutral-900 tracking-tight leading-[1.12] text-balance"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="mt-5 text-lg text-neutral-600 leading-relaxed max-w-2xl"
          >
            {hero.subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button variant="primary" size="lg" to="/app">
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button variant="secondary" size="lg" href="#product">
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mt-14 md:mt-16"
        >
          <HeroProductMockup />
        </motion.div>
      </div>
    </section>
  );
}
