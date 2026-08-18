import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg.asset.json";
import hero2 from "@/assets/hero-2.jpg.asset.json";
import hero3 from "@/assets/hero-3.jpg.asset.json";

const slides = [
  {
    src: hero1.url,
    alt: "Fourtitude consultants collaborating with a client in a modern Nairobi office",
  },
  {
    src: hero2.url,
    alt: "Cybersecurity analyst monitoring systems and network traffic",
  },
  {
    src: hero3.url,
    alt: "Network engineer maintaining server and infrastructure equipment",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % slides.length), []);
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-navy-foreground/15 shadow-2xl">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={1280}
            height={900}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous slide"
          onClick={prev}
          className="h-9 w-9 rounded-full border-navy-foreground/20 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next slide"
          onClick={next}
          className="h-9 w-9 rounded-full border-navy-foreground/20 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-primary"
                : "w-2 bg-navy-foreground/40 hover:bg-navy-foreground/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
