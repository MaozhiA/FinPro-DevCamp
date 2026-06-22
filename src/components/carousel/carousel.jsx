import { useState, useEffect } from 'react';

const slides = [
  {
    category: "Device Contracts",
    title: "Get the latest devices on flexible contracts",
    subtitle: "Phones, laptops, tablets — from R850/month",
    // cta: "View devices",
  },
  {
    category: "Investments",
    title: "Grow your wealth with our investment plans",
    subtitle: "Short-term, long-term and Islamic options available",
    // cta: "Explore investments",
  },
  {
    category: "Insurance",
    title: "Protect what matters most",
    subtitle: "Life cover, funeral cover and retail insurance",
    // cta: "Get a quote",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const previous = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const slide = slides[currentIndex];

  return (
    <div className="bg-white border-b border-slate-200 py-16">
      <div className="max-w-6xl mx-auto px-6">

        <p className="text-xs font-semibold text-sky-600 uppercase tracking-widest mb-3">
          {slide.category}
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 max-w-2xl">
          {slide.title}
        </h1>
        <p className="text-slate-500 text-base mb-8 max-w-xl">
          {slide.subtitle}
        </p>
        {/* <button className="border border-slate-900 text-slate-900 text-sm font-medium px-6 py-3 rounded-full hover:bg-slate-900 hover:text-white transition">
          {slide.cta}
        </button> */}

        <div className="flex items-center gap-6 mt-10">
          {/* <button
            onClick={previous}
            className="text-slate-400 hover:text-slate-900 text-sm transition"
          >
            ← Previous
          </button> */}

          <div className="flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-slate-900 w-6"
                    : "bg-slate-300 w-2"
                }`}
              />
            ))}
          </div>

          {/* <button
            onClick={next}
            className="text-slate-400 hover:text-slate-900 text-sm transition"
          >
            Next →
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default Carousel;