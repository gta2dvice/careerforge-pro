import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white text-xs font-semibold tracking-tight"
        aria-hidden
      >
        CF
      </span>
      <span className="text-sm font-semibold text-neutral-900 tracking-tight">
        CareerForge Pro
      </span>
    </Link>
  );
}
