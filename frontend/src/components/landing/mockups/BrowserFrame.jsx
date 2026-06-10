export default function BrowserFrame({ title = 'app.careerforge.pro', children }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-[11px] text-neutral-500 font-mono bg-white border border-neutral-200 rounded px-3 py-0.5">
            {title}
          </span>
        </div>
      </div>
      <div className="bg-neutral-50">{children}</div>
    </div>
  );
}
