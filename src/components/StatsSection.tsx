import { motion } from "framer-motion";

const stats = [
  { value: "6", label: "Step Pipeline", color: "hsl(var(--brand))" },
  { value: "AES", label: "Encryption", color: "hsl(var(--petal))" },
  { value: "v21", label: "Graph API", color: "hsl(var(--sage))" },
  { value: "0ms", label: "Token Exposure", color: "hsl(var(--amber))" },
];

const StatsSection = () => (
  <div className="max-w-[900px] mx-auto px-5 pb-16">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.5 }}
          className="text-center py-7 px-3 rounded-2xl blossom-card"
        >
          <div
            className="text-2xl md:text-3xl font-display font-bold tracking-tight leading-none mb-1.5"
            style={{ color: s.color, fontStyle: "italic" }}
          >
            {s.value}
          </div>
          <div className="text-muted-foreground text-[0.65rem] font-medium uppercase tracking-widest">{s.label}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default StatsSection;
