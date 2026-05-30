"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Hero blueprint: an orthographic Unitree-Go2-style quadruped crossing rough
 * terrain, drawn in white/graphite linework with topographic contours, joint
 * markers, dimension ticks and a failure-boundary trace. Lines draw in on load;
 * a faint scan sweeps the terrain. All motion is disabled under reduced-motion.
 */
export function HeroScene() {
  const reduce = useReducedMotion();

  const draw = (len: number, delay: number) =>
    reduce
      ? {}
      : {
          initial: { strokeDashoffset: len },
          animate: { strokeDashoffset: 0 },
          transition: { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] as const },
          style: { strokeDasharray: len },
        };

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay },
        };

  return (
    <svg
      viewBox="0 0 1200 720"
      className="hero-svg"
      role="img"
      aria-label="Blueprint terrain field: topographic contours and a stepped terrain profile annotated with parameter axes."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="terrainFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8dde5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#d8dde5" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="sheenStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#bfe3e8" />
          <stop offset="0.6" stopColor="#efd6ec" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* ---- Topographic contour lines (terrain field) ---- */}
      <g stroke="#d8dde5" fill="none" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 470 + i * 46;
          const len = 1300;
          return (
            <motion.path
              key={i}
              d={`M0 ${y} C 240 ${y - 22 - i * 4}, 430 ${y + 16}, 620 ${y - 8} S 980 ${
                y - 30 - i * 5
              }, 1200 ${y - 12}`}
              opacity={0.16 + i * 0.04}
              {...draw(len, 0.2 + i * 0.12)}
            />
          );
        })}
      </g>

      {/* ---- Terrain profile with a step transition ---- */}
      <motion.path
        d="M0 560 L 250 552 L 360 548 L 470 556 L 600 540 L 700 540 L 700 484 L 900 480 L 1010 492 L 1200 486"
        fill="none"
        stroke="#f4f2ec"
        strokeWidth="1.6"
        {...draw(1500, 0.4)}
      />
      <path
        d="M0 560 L 250 552 L 360 548 L 470 556 L 600 540 L 700 540 L 700 484 L 900 480 L 1010 492 L 1200 486 L 1200 720 L 0 720 Z"
        fill="url(#terrainFade)"
        opacity="0.5"
      />

      {/* dimension tick for the step height */}
      <motion.g stroke="#bfc3c9" strokeWidth="1" {...fade(1.5)}>
        <path d="M724 484 L 724 540" />
        <path d="M719 484 L 729 484 M719 540 L 729 540" />
        <text x="734" y="516" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="13">
          step_height = 0.28 m
        </text>
      </motion.g>

      {/* parameter axis ticks bottom-left */}
      <motion.g {...fade(2.0)} stroke="#bfc3c9" strokeWidth="1" opacity="0.6">
        <path d="M70 660 L 320 660" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${70 + i * 50} 656 L ${70 + i * 50} 664`} />
        ))}
        <text x="70" y="684" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="11">
          ground_friction
        </text>
        <text x="288" y="684" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="11">
          1.40
        </text>
      </motion.g>

      {/* slow terrain scan */}
      {!reduce && (
        <motion.rect
          x="0"
          y="455"
          width="2"
          height="200"
          fill="#bfe3e8"
          opacity="0.5"
          initial={{ x: 80 }}
          animate={{ x: [80, 1120, 80] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}
