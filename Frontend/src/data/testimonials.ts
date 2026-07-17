import type { Testimonial } from "../types";

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "Cursorline found a race condition spanning three services that our team had missed for months. The cross-file context is a genuine leap over every other assistant I've tried.",
    role: "Staff Engineer",
    team: "Fintech infra team",
  },
  {
    quote:
      "I refactored our entire authentication module — 22 files — in a single session. Cursorline tracked every import, every type reference, and every test that needed updating.",
    role: "Senior Developer",
    team: "SaaS platform team",
  },
  {
    quote:
      "The PR review feature alone saves us an hour per merge. It catches logic errors, suggests improvements, and actually understands our coding conventions.",
    role: "Engineering Manager",
    team: "Developer tooling startup",
  },
];
