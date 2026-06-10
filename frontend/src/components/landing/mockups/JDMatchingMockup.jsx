import BrowserFrame from './BrowserFrame';

export default function JDMatchingMockup() {
  return (
    <BrowserFrame title="app.careerforge.pro/analyze">
      <div className="p-4 min-h-[220px] bg-white grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-medium text-neutral-500 mb-1.5">Job description</p>
          <div className="border border-neutral-200 rounded p-2 h-32 bg-neutral-50 text-[9px] text-neutral-600 leading-relaxed">
            Senior Full Stack Engineer with experience in React, Node.js, and cloud
            infrastructure. Strong communication skills required...
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-neutral-500 mb-1.5">Extracted signals</p>
          <div className="space-y-2">
            {[
              { label: 'Technical', items: ['React', 'Node.js', 'AWS'] },
              { label: 'Tools', items: ['Git', 'Docker'] },
            ].map((group) => (
              <div key={group.label}>
                <p className="text-[9px] text-neutral-400 mb-0.5">{group.label}</p>
                <div className="flex flex-wrap gap-1">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[9px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
