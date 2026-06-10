import Section, { SectionHeader } from './ui/Section';
import { howItWorksSteps } from '../../data/landingContent';

export default function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-neutral-50 border-y border-neutral-200">
      <SectionHeader label="How It Works" title="From resume draft to application-ready" />
      <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
        {howItWorksSteps.map(({ step, title, description }) => (
          <li key={step}>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">{step}</span>
            <h3 className="mt-3 text-base font-semibold text-neutral-900">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
