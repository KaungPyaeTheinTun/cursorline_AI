import type { Feature } from "../types";

export const features: readonly Feature[] = [
  {
    icon: "📂",
    title: "Whole-Repo Context",
    description:
      "Cursorline indexes your entire repository so every suggestion understands your project's architecture, not just the file you're editing.",
  },
  {
    icon: "🔍",
    title: "Trace-Back Debugging",
    description:
      "Paste a stack trace and Cursorline walks backward through your codebase to pinpoint the root cause across every involved file.",
  },
  {
    icon: "🔄",
    title: "Multi-File Refactors",
    description:
      "Rename a service, restructure a module, or migrate an API — Cursorline coordinates changes across every file that needs to update.",
  },
  {
    icon: "💡",
    title: "Explains Its Reasoning",
    description:
      "Every suggestion comes with a plain-English explanation so you understand the why, not just the what, before you accept a change.",
  },
  {
    icon: "🌿",
    title: "Git-Aware PR Review",
    description:
      "Cursorline reads your branch diff, understands commit history, and leaves actionable review comments tied to the exact lines that matter.",
  },
  {
    icon: "⚙️",
    title: "Runs in Your Editor",
    description:
      "No context-switching required. Cursorline plugs into VS Code, Neovim, JetBrains, and more — right where you already work.",
  },
];
