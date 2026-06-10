import Section, { SectionHeader } from './ui/Section';
import ProductMockup from './mockups/ProductMockup';
import { productPreviews } from '../../data/landingContent';

export default function ProductPreview() {
  return (
    <Section id="product" className="bg-neutral-50 border-y border-neutral-200 py-20 md:py-24">
      <SectionHeader
        label="Product"
        title="See how it fits your workflow"
        description="Builder, ATS analysis, and job-description parsing in one application."
      />
      <div className="grid gap-10 lg:grid-cols-3">
        {productPreviews.map(({ title, description, mockup }) => (
          <article key={title}>
            <ProductMockup type={mockup} />
            <h3 className="mt-5 text-base font-semibold text-neutral-900">{title}</h3>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
