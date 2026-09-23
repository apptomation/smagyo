import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MousePointerClick } from "lucide-react";

// ─── POC 1: gently swaying flower + glassmorphism control panel ───────────────
function SwayingBloomPOC() {
  const [thought, setThought] = useState("");
  const [blooming, setBlooming] = useState(false);

  const handleBloom = () => {
    if (!thought.trim()) return;
    setBlooming(true);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{
        background: "linear-gradient(160deg, #FBF3EC 0%, #F3EBE0 40%, #DCE8DC 75%, #B7CBB0 100%)",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E9D8CC, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #A9C0A0, transparent 70%)" }}
      />

      {/* Central animated flower canvas */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-xl h-[60vh]">
        <motion.div
          className="relative"
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "bottom center" }}
        >
          <motion.img
            src="/images/redroses.jpg"
            alt="Animated rose"
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl"
            style={{ boxShadow: "0 30px 60px -20px rgba(45,106,79,.35)" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: blooming ? [1, 1.08, 1] : 1,
              opacity: 1,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <AnimatePresence>
            {blooming && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{ boxShadow: "0 0 0 4px rgba(244,165,165,.5)" }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {blooming && thought && (
            <motion.p
              className="mt-8 text-center text-sm md:text-base italic max-w-sm"
              style={{ color: "#2D6A4F", fontFamily: "'Playfair Display', Georgia, serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              "{thought}" has bloomed into something beautiful.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Floating glassmorphism control panel */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="flex items-center gap-2 rounded-full px-3 py-2.5 shadow-xl"
          style={{
            background: "rgba(255,255,255,.55)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,.6)",
          }}
        >
          <input
            type="text"
            value={thought}
            onChange={(e) => {
              setThought(e.target.value);
              if (blooming) setBlooming(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleBloom()}
            placeholder="Type a thought to grow a flower..."
            className="flex-1 bg-transparent outline-none text-sm px-3"
            style={{ color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif" }}
          />
          <motion.button
            onClick={handleBloom}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #2D6A4F, #52796F)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Sparkles size={14} /> Bloom
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ─── POC 2: organic-growth stem + elastic petal unfold + rAF pollen drift ─────
const PETAL_COUNT = 8;
const POLLEN_COUNT = 14;

function makePollenParticle() {
  return {
    x: (Math.random() - 0.5) * 8,
    drift: (Math.random() - 0.5) * 22,
    maxLife: 55 + Math.random() * 55,
    age: Math.random() * 90, // stagger initial spawn
  };
}

function GrowingFlowerPOC() {
  const [stemDone, setStemDone] = useState(false);
  const [hovering, setHovering] = useState(false);
  const pollenElRefs = useRef([]);
  const pollenData = useRef([]);
  const rafRef = useRef(null);

  if (pollenData.current.length === 0) {
    pollenData.current = Array.from({ length: POLLEN_COUNT }, makePollenParticle);
  }

  useEffect(() => {
    if (!hovering) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      pollenElRefs.current.forEach((el) => {
        if (el) el.style.opacity = "0";
      });
      return;
    }

    const tick = () => {
      pollenData.current.forEach((p, i) => {
        p.age += 1;
        if (p.age > p.maxLife) {
          pollenData.current[i] = makePollenParticle();
          pollenData.current[i].age = 0;
          return;
        }
        const t = p.age / p.maxLife;
        const y = -t * 90;
        const x = p.x + Math.sin(t * Math.PI * 2) * (p.drift / 3);
        const opacity = t < 0.12 ? t / 0.12 : t > 0.75 ? Math.max(0, (1 - t) / 0.25) : 1;
        const el = pollenElRefs.current[i];
        if (el) {
          el.style.transform = `translate(${x}px, ${y}px)`;
          el.style.opacity = String(opacity * 0.9);
        }
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hovering]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background: "linear-gradient(160deg, #FBEFF3 0%, #F6E9E4 45%, #EDE4F2 100%)",
      }}
    >
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E9C7D3, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-28 -left-20 w-[440px] h-[440px] rounded-full opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9B9E0, transparent 70%)" }}
      />

      <span
        className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-8"
        style={{ background: "rgba(45,106,79,.1)", color: "#2D6A4F", fontFamily: "'DM Sans', sans-serif" }}
      >
        <MousePointerClick size={11} /> POC 2 · Hover the bloom
      </span>

      <div
        className="relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <svg
          viewBox="0 0 200 340"
          width={260}
          height={442}
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id="petalGradient" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FBD3E0" />
              <stop offset="100%" stopColor="#E38FB0" />
            </radialGradient>
          </defs>

          {/* Organic-curve stem, grows upward on load */}
          <motion.path
            d="M100,338 C72,282 132,238 92,188 C60,146 122,116 100,88"
            fill="none"
            stroke="#4A7A5E"
            strokeWidth={5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            onAnimationComplete={() => setStemDone(true)}
          />

          {/* Leaves, unfurl partway through the stem's growth */}
          <motion.path
            d="M94,225 C65,220 45,235 36,258 C62,258 88,248 94,225 Z"
            fill="#5C8A6B"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "94px 225px" }}
          />
          <motion.path
            d="M97,175 C126,168 146,180 156,202 C130,204 103,196 97,175 Z"
            fill="#6B9B79"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "97px 175px" }}
          />

          {/* Petals + pollen center, elastic spring unfold once the stem lands */}
          <g transform="translate(100,88)">
            {stemDone &&
              Array.from({ length: PETAL_COUNT }).map((_, i) => {
                const angle = (360 / PETAL_COUNT) * i;
                return (
                  <g key={i} transform={`rotate(${angle})`}>
                    <motion.ellipse
                      cx={0}
                      cy={-28}
                      rx={15}
                      ry={26}
                      fill="url(#petalGradient)"
                      style={{ transformOrigin: "0px 0px" }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 11, delay: i * 0.06 }}
                    />
                  </g>
                );
              })}
            {stemDone && (
              <motion.circle
                r={13}
                fill="#EFB84C"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: PETAL_COUNT * 0.06 + 0.1 }}
              />
            )}
          </g>
        </svg>

        {/* Pollen particles: lightweight rAF loop, driven outside React state */}
        <div
          className="absolute pointer-events-none"
          style={{ left: "50%", top: `${(88 / 340) * 100}%` }}
        >
          {Array.from({ length: POLLEN_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (pollenElRefs.current[i] = el)}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                marginLeft: -2,
                marginTop: -2,
                background: "#F2C879",
                boxShadow: "0 0 6px 1px rgba(242,200,121,.8)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      </div>

      <p
        className="relative mt-10 text-sm text-center max-w-xs"
        style={{ color: "#52796F", fontFamily: "'DM Sans', sans-serif" }}
      >
        Stem grows on load, petals unfold with spring physics, pollen drifts on hover.
      </p>
    </section>
  );
}

// ─── AnimationPOC page ─────────────────────────────────────────────────────────
export default function AnimationPOC() {
  return (
    <>
      <SwayingBloomPOC />
      <GrowingFlowerPOC />
    </>
  );
}
