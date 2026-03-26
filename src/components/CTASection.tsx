import { motion } from "framer-motion";
import { Flower2, ArrowRight } from "lucide-react";

const CTASection = ({ onLaunch }: { onLaunch: () => void }) => (
  <section className="px-5 py-16 pb-24 text-center relative z-[1]">
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-[520px] mx-auto">
      {/* Decorative petals */}
      <div className="flex justify-center gap-3 text-2xl mb-6 animate-float">
        <span>🌸</span>
        <span style={{ animationDelay: "0.5s" }}>🌺</span>
        <span style={{ animationDelay: "1s" }}>🌷</span>
      </div>

      <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight mb-4" style={{ fontStyle: "italic" }}>
        Ready to <span className="grad-text">Go Live?</span>
      </h2>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Connect your Facebook account and publish your first professional post — or schedule it for the perfect moment.
      </p>
      <button
        onClick={onLaunch}
        className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm cursor-pointer border-none btn-primary"
      >
        <Flower2 className="w-4 h-4" /> Open Publisher
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  </section>
);

export default CTASection;
