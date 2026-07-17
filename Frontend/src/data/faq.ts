import type { FAQEntry } from "../types";

export const faqEntries: readonly FAQEntry[] = [
  {
    question: "Is my code sent to external servers?",
    answer:
      "Cursorline processes your codebase locally by default. When cloud features are enabled, only encrypted diffs and metadata leave your machine — never full source files. We are SOC 2 Type II compliant and never train on your code.",
  },
  {
    question: "Which editors and IDEs are supported?",
    answer:
      "Cursorline ships first-party extensions for VS Code, Neovim, and JetBrains IDEs (IntelliJ, PyCharm, WebStorm, and more). A generic LSP adapter is also available for other editors.",
  },
  {
    question: "Does it work with large or legacy codebases?",
    answer:
      "Yes. Cursorline uses incremental indexing so repos with millions of lines are handled efficiently. It respects .gitignore and .cursorlineignore to skip generated files, and it supports monorepo setups out of the box.",
  },
  {
    question: "What does the free plan include?",
    answer:
      "The free plan gives you 50 completions per day, single-repo indexing, stack trace analysis, and access to the VS Code extension — no credit card required. Upgrade to Pro for unlimited usage and advanced features.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your Pro or Team plan from your dashboard at any time. Your access continues until the end of the current billing period — no prorated charges, no cancellation fees.",
  },
];
