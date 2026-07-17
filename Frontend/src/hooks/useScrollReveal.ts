import { useEffect, useRef } from "react";

const SELECTOR =
  ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-up";

export function useScrollReveal(threshold = 0.12): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>(SELECTOR).forEach((child) => {
        child.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    el.querySelectorAll<HTMLElement>(SELECTOR).forEach((child) =>
      observer.observe(child),
    );

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
