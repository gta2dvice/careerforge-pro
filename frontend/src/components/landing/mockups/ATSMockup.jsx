import BrowserFrame from './BrowserFrame';

export default function ATSMockup() {
  return (
    <BrowserFrame title="app.careerforge.pro/optimizer">
      <div className="p-4 min-h-[220px] bg-white">
        <p className="text-xs font-semibold text-neutral-900 mb-3">ATS Score Analysis</p>
        <div className="flex gap-4 items-start">
          <div className="shrink-0 w-20 h-20 rounded-full border-[6px] border-neutral-900 flex items-center justify-center">
            <span className="text-lg font-semibold text-neutral-900">74%</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-neutral-500">Matched keywords</span>
              <span className="font-medium text-neutral-900">18</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-neutral-500">Missing keywords</span>
              <span className="font-medium text-neutral-900">6</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full w-[74%] bg-neutral-800 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {['React', 'TypeScript', 'Node.js'].map((k) => (
                <span key={k} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[9px]">
                  {k}
                </span>
              ))}
              <span className="px-1.5 py-0.5 border border-dashed border-neutral-300 text-neutral-500 rounded text-[9px]">
                + GraphQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
