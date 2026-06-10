import { FileText, BarChart3, PenLine, Tags, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Section, { SectionHeader } from './ui/Section';
import { features as featureList } from '../../data/landingContent';

const iconMap = {
  file: FileText,
  chart: BarChart3,
  pen: PenLine,
  tags: Tags,
  download: Download,
};

export default function Features() {
  return (
    <Section id="features">
      <SectionHeader
        label="Features"
        title="Tools for a serious job search"
        description="No template marketplace—just resume building and JD-aware optimization."
      />
      <div className="grid gap-px bg-neutral-200 rounded-lg overflow-hidden border border-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map(({ icon, title, description }, index) => {
          const Icon = iconMap[icon];
          return (
            <motion.div 
              key={title} 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ 
                scale: 1.015,
                backgroundColor: '#fafafa',
                transition: { duration: 0.15 }
              }}
              className="bg-white p-6 md:p-8 flex flex-col h-full cursor-pointer transition-all duration-200"
            >
              <div className="p-2.5 bg-neutral-50 rounded-lg w-fit mb-1 border border-neutral-100">
                <Icon className="h-5 w-5 text-neutral-800" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed flex-1">{description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
