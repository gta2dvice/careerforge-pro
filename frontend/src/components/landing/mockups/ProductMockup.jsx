import ResumeBuilderMockup from './ResumeBuilderMockup';
import ATSMockup from './ATSMockup';
import JDMatchingMockup from './JDMatchingMockup';

const mockups = {
  resume: ResumeBuilderMockup,
  ats: ATSMockup,
  jd: JDMatchingMockup,
};

export default function ProductMockup({ type = 'resume' }) {
  const Component = mockups[type] || ResumeBuilderMockup;
  return <Component />;
}

/** Full-width hero preview — combined builder + ATS panel */
export function HeroProductMockup() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        </div>
        <span className="flex-1 text-center text-[11px] text-neutral-500 font-mono">
          app.careerforge.pro
        </span>
      </div>
      <div className="grid lg:grid-cols-[1fr_280px] min-h-[320px] bg-neutral-50">
        <div className="border-r border-neutral-200 bg-white p-4">
          <div className="flex gap-2 mb-4">
            {['Editor', 'Preview', 'AI'].map((tab, i) => (
              <span
                key={tab}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${
                  i === 2
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                Experience
              </p>
              <div className="h-8 border border-neutral-200 rounded-md bg-neutral-50" />
              <div className="h-20 border border-neutral-200 rounded-md bg-neutral-50" />
            </div>
            <div className="border border-neutral-200 rounded-md p-3 bg-white">
              <p className="text-xs font-semibold text-neutral-900">Jordan Lee</p>
              <p className="text-[10px] text-neutral-500">Full Stack Engineer</p>
              <div className="mt-3 space-y-1.5">
                <div className="h-1 bg-neutral-100 rounded w-full" />
                <div className="h-1 bg-neutral-100 rounded w-[92%]" />
                <div className="h-1 bg-neutral-100 rounded w-[78%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white">
          <p className="text-xs font-semibold text-neutral-900 mb-3">ATS match</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full border-[5px] border-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold">68%</span>
            </div>
            <div className="text-[10px] text-neutral-600 space-y-1">
              <p>
                <span className="text-neutral-900 font-medium">14</span> matched
              </p>
              <p>
                <span className="text-neutral-900 font-medium">5</span> missing
              </p>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 mb-1.5">Missing</p>
          <div className="flex flex-wrap gap-1">
            {['Kubernetes', 'GraphQL', 'CI/CD'].map((k) => (
              <span
                key={k}
                className="text-[9px] px-1.5 py-0.5 border border-neutral-200 text-neutral-600 rounded"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
