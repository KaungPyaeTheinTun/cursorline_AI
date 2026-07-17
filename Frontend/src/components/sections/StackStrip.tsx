import { SiTypescript, SiJavascript, SiPython, SiRust, SiGo, SiCplusplus, SiRuby, SiPhp, SiSwift, SiKotlin, SiSharp } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import LogoLoop from '../ui/LogoLoop';

const techLogos = [
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiJavascript />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiPython />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiRust />, title: 'Rust', href: 'https://www.rust-lang.org' },
  { node: <SiGo />, title: 'Go', href: 'https://go.dev' },
  { node: <FaJava />, title: 'Java', href: 'https://www.java.com' },
  { node: <SiCplusplus />, title: 'C++', href: 'https://isocpp.org' },
  { node: <SiRuby />, title: 'Ruby', href: 'https://www.ruby-lang.org' },
  { node: <SiPhp />, title: 'PHP', href: 'https://www.php.net' },
  { node: <SiSwift />, title: 'Swift', href: 'https://www.swift.org' },
  { node: <SiKotlin />, title: 'Kotlin', href: 'https://kotlinlang.org' },
  { node: <SiSharp />, title: 'C#', href: 'https://learn.microsoft.com/en-us/dotnet/csharp' },
];

export default function StackStrip() {
  return (
    <section className="border-y border-line/50 bg-surface/30 backdrop-blur-sm py-10 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-xs font-mono uppercase tracking-widest text-muted">
          Supports your stack
        </p>
      </div>
      <LogoLoop
        logos={techLogos}
        speed={60}
        direction="left"
        logoHeight={32}
        gap={48}
        hoverSpeed={0}
        fadeOut
        fadeOutColor="#0B0E14"
        scaleOnHover
        ariaLabel="Supported technologies"
      />
    </section>
  );
}
