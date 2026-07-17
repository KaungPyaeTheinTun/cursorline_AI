import { useState, useCallback } from "react";

interface AccordionItem {
  readonly question: string;
  readonly answer: string;
}

interface AccordionProps {
  readonly items: readonly AccordionItem[];
  readonly defaultOpen?: number;
}

export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-ink hover:bg-surface2 transition-colors"
            >
              <span>{item.question}</span>
              <span
                className={`ml-4 shrink-0 text-muted transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              role="region"
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
