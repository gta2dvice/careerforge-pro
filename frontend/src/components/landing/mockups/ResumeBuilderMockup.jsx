import BrowserFrame from './BrowserFrame';

export default function ResumeBuilderMockup() {
  return (
    <BrowserFrame>
      <div className="flex min-h-[220px] text-[10px]">
        <aside className="w-36 border-r border-neutral-200 bg-white p-3 space-y-2">
          <p className="font-semibold text-neutral-900 text-xs mb-2">Sections</p>
          {['Contact', 'Experience', 'Projects', 'Education', 'Skills'].map((item, i) => (
            <div
              key={item}
              className={`px-2 py-1 rounded ${i === 0 ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-500'}`}
            >
              {item}
            </div>
          ))}
        </aside>
        <div className="flex-1 p-3 grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-2 w-16 bg-neutral-200 rounded" />
            <div className="h-7 border border-neutral-200 rounded bg-white" />
            <div className="h-7 border border-neutral-200 rounded bg-white" />
            <div className="h-16 border border-neutral-200 rounded bg-white" />
          </div>
          <div className="bg-white border border-neutral-200 rounded p-2 shadow-sm">
            <p className="text-[9px] font-semibold text-neutral-800 mb-1">Preview</p>
            <p className="text-xs font-semibold text-neutral-900">Alex Chen</p>
            <p className="text-[9px] text-neutral-500">Software Engineer</p>
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full bg-neutral-100 rounded" />
              <div className="h-1 w-4/5 bg-neutral-100 rounded" />
              <div className="h-1 w-3/5 bg-neutral-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
