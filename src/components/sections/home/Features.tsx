// src/components/sections/home/Features.tsx
import Card from '@/components/common/Card';

export default function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="container-padding section-padding bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            id="features-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground"
          >
            How It Works
          </h2>
          <p className="mt-4 text-lg text-secondary max-w-2xl mx-auto">
            Paste your content, get instant improvements. It's that simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card variant="primary" title="Polish Content">
            <p className="text-secondary">
              Instant improvements to grammar, style, and readability while preserving your unique voice.
            </p>
          </Card>

          <Card variant="primary" title="SEO Enhancement">
            <p className="text-secondary">
              Get optimized meta descriptions and title suggestions that help your content rank better.
            </p>
          </Card>

          <Card variant="primary" title="Smart Keywords">
            <p className="text-secondary">
              Discover and integrate relevant keywords that improve your content's visibility.
            </p>
          </Card>

          <Card variant="primary" title="Instant Results">
            <p className="text-secondary">
              Download your enhanced content instantly, with all improvements clearly marked.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}