export default function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({ label, title, description, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center mx-auto max-w-2xl';

  return (
    <div className={`mb-14 ${alignClass}`}>
      {label && (
        <p className="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
