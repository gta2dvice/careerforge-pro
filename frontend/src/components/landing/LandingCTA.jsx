import { Link } from 'react-router-dom';
import Button from './ui/Button';

export default function LandingCTA() {
  return (
    <section className="border-t border-neutral-200 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight text-balance">
          Start with your next job description
        </h2>
        <p className="mt-3 text-neutral-600 max-w-lg mx-auto text-sm md:text-base">
          Open the builder, paste a listing, and see where your resume stands before you apply.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" to="/app">
            Get Started
          </Button>
          <Link
            to="/app"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Open app →
          </Link>
        </div>
      </div>
    </section>
  );
}
