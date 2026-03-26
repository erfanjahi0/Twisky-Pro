import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Lock, Clock, Image, Database, Palette, Smartphone, CalendarClock } from "lucide-react";

const features = [
  { icon: Lock, title: "End-to-End Encrypted", desc: "Every API call runs through a secure edge function. No tokens or payloads are exposed.", color: "hsl(var(--brand))" },
  { icon: Clock, title: "6-Step Pipeline", desc: "From image upload to live post verification — the entire pipeline runs in seconds.", color: "hsl(var(--amber))" },
  { icon: Image, title: "Premium Creatives", desc: "Upload square images with custom headlines, captions, display URLs, and 18 CTA types.", color: "hsl(var(--petal))" },
  { icon: CalendarClock, title: "Schedule Posts", desc: "Pick a future date and time to publish. Posts go live automatically via the Meta API.", color: "hsl(var(--cherry))" },
  { icon: Database, title: "Persistent Storage", desc: "Credentials saved securely in local storage and restored on every visit.", color: "hsl(var(--sage))" },
  { icon: Palette, title: "Pink Blossom UI", desc: "Soft whites and rose pinks with petal animations, glassmorphism, and refined typography.", color: "hsl(var(--brand-light))" },
  { icon: Smartphone, title: "Fully Responsive", desc: "Pixel-perfect on every device with touch-optimized interactions.", color: "hsl(var(--petal-light))" },
];

const FeaturesSection = forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className="px-5 py-20 w-full">
    <div className="max-w-[1000px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-tight mb-3 px-2" style={{ fontStyle: "italic" }}>
          Everything You Need to{" "}
          <span className="grad-text">Publish Like a Pro</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-[400px] mx-auto">Built for agencies, power users, and marketers who demand speed and beauty.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="rounded-2xl p-5 blossom-card cursor-default"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
            >
              <f.icon className="w-4 h-4" style={{ color: f.color }} />
            </div>
            <div className="text-sm font-semibold mb-1.5 tracking-tight text-foreground">{f.title}</div>
            <div className="text-muted-foreground text-xs leading-relaxed">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));

FeaturesSection.displayName = "FeaturesSection";
export default FeaturesSection;
