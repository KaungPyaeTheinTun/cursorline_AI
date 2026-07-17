export interface Feature {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface PricingTier {
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly highlighted: boolean;
  readonly plan: string;
}

export interface Plan {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly price: number;
  readonly period: string;
  readonly description: string | null;
  readonly features: string[] | null;
  readonly cta: string;
  readonly highlighted: boolean;
  readonly is_active: boolean;
  readonly sort_order: number;
  readonly usage_duration_minutes: number;
}

export interface Testimonial {
  readonly quote: string;
  readonly role: string;
  readonly team: string;
}

export interface FAQEntry {
  readonly question: string;
  readonly answer: string;
}

export interface ChatMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface NavLink {
  readonly label: string;
  readonly href: string;
}
