import {
  Navbar,
  Hero,
  ProductPreview,
  Features,
  HowItWorks,
  Pricing,
  LandingCTA,
  Footer,
} from '../components/landing';

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-white text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900">
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <HowItWorks />
        <Pricing />
        <LandingCTA />
      </main>
      <Footer />
    </div>
  );
}
