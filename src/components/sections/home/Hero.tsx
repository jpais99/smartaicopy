// src/components/sections/home/Hero.tsx

export default function Hero() {
  return (
    <section 
      aria-labelledby="hero-heading" 
      className="container-padding section-padding"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 
            id="hero-heading"
            className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground"
          >
            Transform Your Content
            <span className="text-accent"> with AI</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary max-w-2xl mx-auto">
            Professional-grade content optimization powered by artificial intelligence.
            Enhance your writing while maintaining your unique voice.
          </p>
        </div>
      </div>
    </section>
  );
}