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
      aria-label="Blueprint of a quadruped robot crossing stepped terrain, annotated with joint markers, a failure-boundary contour and parameter ticks."
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

      {/* ---- Failure-boundary trace (isoline) with a break point ---- */}
      <motion.path
        d="M120 300 C 320 300, 360 250, 540 250 C 720 250, 760 360, 1080 330"
        fill="none"
        stroke="#d34b4b"
        strokeWidth="1.4"
        strokeDasharray="6 5"
        opacity="0.85"
        {...(reduce
          ? {}
          : {
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 0.85 },
              transition: { duration: 1.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] as const },
            })}
      />
      <motion.g {...fade(2.4)}>
        <circle cx="640" cy="293" r="6" fill="none" stroke="#d34b4b" strokeWidth="1.4" />
        <circle cx="640" cy="293" r="2" fill="#d34b4b" />
        <text x="654" y="289" fill="#d34b4b" fontFamily="var(--font-mono)" fontSize="13">
          break_point · cluster_03
        </text>
        <text x="124" y="292" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="12" opacity="0.8">
          failure boundary
        </text>
      </motion.g>

      {/* ---- Quadruped (orthographic side view) ---- */}
      <motion.g {...fade(0.9)} stroke="#f4f2ec" fill="none" strokeWidth="1.5">
        {/* far legs (dimmer) */}
        <g opacity="0.4" strokeWidth="1.2">
          <path d="M512 470 L 506 520 L 520 548" />
          <path d="M648 470 L 660 520 L 648 540" />
        </g>

        {/* torso */}
        <path d="M470 432 q -8 -34 34 -36 l 150 0 q 30 0 40 22 l 8 18 q 4 14 -10 16 l -208 0 q -18 -2 -14 -36 Z" />
        {/* head / sensor block */}
        <path d="M652 418 l 44 -2 q 18 0 18 16 l 0 18 q 0 12 -16 12 l -36 0" />
        <circle cx="700" cy="438" r="3.4" fill="#bfc3c9" stroke="none" />
        <path d="M704 430 L 726 422" stroke="#bfc3c9" strokeWidth="1" />

        {/* near front leg */}
        <path d="M626 466 L 636 512 L 624 548" />
        {/* near rear leg */}
        <path d="M494 466 L 484 512 L 498 548" />

        {/* joint markers */}
        <g fill="#050505" stroke="#f4f2ec" strokeWidth="1.4">
          <circle cx="626" cy="466" r="4.5" />
          <circle cx="636" cy="512" r="4" />
          <circle cx="494" cy="466" r="4.5" />
          <circle cx="484" cy="512" r="4" />
        </g>
      </motion.g>

      {/* joint / contact labels */}
      <motion.g {...fade(1.8)} fontFamily="var(--font-mono)" fontSize="12" fill="#bfc3c9">
        <path d="M636 512 L 690 512" stroke="#bfc3c9" strokeWidth="0.8" opacity="0.6" />
        <text x="696" y="516">knee · θ2</text>
        <path d="M626 466 L 690 466" stroke="#bfc3c9" strokeWidth="0.8" opacity="0.6" />
        <text x="696" y="470">hip · θ1</text>
        {/* contact markers */}
        <g stroke="#d8a034" strokeWidth="1.3">
          <path d="M618 548 L 630 548 M624 542 L 624 554" />
          <path d="M492 548 L 504 548 M498 542 L 498 554" />
        </g>
        <text x="470" y="572" fill="#d8a034">contact · μ=0.28</text>
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
