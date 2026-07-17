import { useFaq } from "../../hooks/useFaq";
import Accordion from "../ui/Accordion";

interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

export default function FAQ() {
  const { faqs: rawFaqs } = useFaq();
  const faqs = rawFaqs as readonly FaqEntry[];

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 md:py-28 bg-surface/30">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <Accordion items={faqs} defaultOpen={0} />
      </div>
    </section>
  );
}
