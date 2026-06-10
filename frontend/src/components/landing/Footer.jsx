import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import { footerLinks } from '../../data/landingContent';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-neutral-600 max-w-xs leading-relaxed">
              Resume tooling for engineers and technical candidates who optimize against real job
              descriptions.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                {group}
              </p>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between gap-2 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} CareerForge Pro</p>
        </div>
      </div>
    </footer>
  );
}
