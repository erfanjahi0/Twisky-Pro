import { motion } from "framer-motion";
import { Flower2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLaunch: () => void;
  onExplore: () => void;
}

const ease = [0.25, 1, 0.5, 1] as const;

const HeroSection = ({ onLaunch, onExplore }: HeroSectionProps) => {
  return (
    <section className="min-h-[calc(100svh-64px)] flex flex-col items-center justify-center text-center px-5 py-20 relative overflow-hidden">
      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.65rem] font-semibold tracking-wider uppercase mb-8"
          style={{ background: "hsl(var(--blush))", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand) / 0.2)", boxShadow: "0 2px 12px hsl(var(--brand-dim))" }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Encrypted · Secure · Beautiful
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease }}
        className="font-display font-bold text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-5 max-w-[780px]"
        style={{ fontStyle: "italic" }}
      >
        Publish{" "}
        <span className="grad-text-blossom">Blooming</span>
        <br />
        Facebook Content
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease }}
        className="text-muted-foreground text-[clamp(0.875rem,1.8vw,1.05rem)] max-w-[480px] leading-relaxed mb-10 px-4"
      >
        The ultimate tool for publishing premium page posts with custom creatives, CTA buttons, scheduled delivery, and secure API calls.
      </motion.p>

      {/* Floating blossom decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="absolute top-20 right-12 text-4xl animate-float hidden lg:block"
        style={{ filter: "drop-shadow(0 4px 8px hsl(335 70% 60% / 0.2))" }}
      >
        🌸
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="absolute bottom-32 left-16 text-3xl animate-petal-drift hidden lg:block"
        style={{ filter: "drop-shadow(0 4px 8px hsl(350 65% 72% / 0.2))", animationDelay: "1s" }}
      >
        🌺
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24, ease }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <button
          onClick={onLaunch}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm cursor-pointer border-none btn-primary"
        >
          <Flower2 className="w-4 h-4" /> Launch App
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm cursor-pointer border transition-all"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))", background: "hsl(0 0% 100%)", boxShadow: "var(--shadow-sm)" }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-md)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
        >
          <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--petal))" }} /> Explore Features
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
