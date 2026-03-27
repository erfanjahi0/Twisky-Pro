import { useEffect, useRef } from "react";

const PETALS = ["🌸", "🌺", "🌷", "🌹", "✿", "❀", "🏵️"];

const PetalBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const count = 18;
    const petals: HTMLSpanElement[] = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const emoji = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.textContent = emoji;
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 0;
        font-size: ${0.6 + Math.random() * 0.9}rem;
        left: ${Math.random() * 110 - 5}%;
        animation: petal-fall ${8 + Math.random() * 12}s linear infinite;
        animation-delay: ${-Math.random() * 20}s;
        --drift: ${(Math.random() - 0.5) * 80}px;
        --rot: ${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360)}deg;
        opacity: 0;
        filter: drop-shadow(0 2px 4px hsl(335 70% 60% / 0.15));
      `;
      container.appendChild(el);
      petals.push(el);
    }

    return () => { petals.forEach(p => p.remove()); };
  }, []);

  return (
    <>
      {/* Petals container */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0" />

      {/* Soft ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left blob */}
        <div
          className="absolute animate-blossom-pulse"
          style={{
            top: "-10%",
            left: "-5%",
            width: "55vw",
            height: "55vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(335 80% 75% / 0.12) 0%, transparent 70%)",
            animationDelay: "0s",
          }}
        />
        {/* Top-right blob */}
        <div
          className="absolute animate-blossom-pulse"
          style={{
            top: "-5%",
            right: "-10%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(350 75% 80% / 0.1) 0%, transparent 65%)",
            animationDelay: "1.5s",
          }}
        />
        {/* Bottom-center blob */}
        <div
          className="absolute animate-blossom-pulse"
          style={{
            bottom: "-15%",
            left: "30%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(355 80% 88% / 0.15) 0%, transparent 65%)",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 mesh-bg" />
    </>
  );
};

export default PetalBg;
