import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import Button from './ui/Button';
import { navLinks } from '../../data/landingContent';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {navLinks.map((link) => (
            link.to ? (
              <Link
                key={link.href}
                to={link.to}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" to="/app">
            Login
          </Button>
          <Button variant="primary" size="sm" to="/app">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-neutral-600"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.href}
                  to={link.to}
                  className="text-sm text-neutral-700 py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-700 py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
              <Button variant="ghost" size="md" to="/app" className="w-full justify-center">
                Login
              </Button>
              <Button variant="primary" size="md" to="/app" className="w-full justify-center">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
