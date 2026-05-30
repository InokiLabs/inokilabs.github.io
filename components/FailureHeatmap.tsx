"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Failure heatmap over two parameter axes (ground_friction × step_height),
 * rendered as monochrome contour isolines with selective red/amber marks for
 * actual failures. Failure points accumulate as the panel enters view.
 */
const FAILURES = [
  { x: 78, y: 96, sev: "high" },
  { x: 92, y: 110, sev: "high" },
  { x: 104, y: 88, sev: "high" },
  { x: 120, y: 120, sev: "high" },
  { x: 96, y: 130, sev: "med" },
  { x: 150, y: 70, sev: "med" },
  { x: 168, y: 92, sev: "med" },
  { x: 200, y: 64, sev: "low" },
  { x: 232, y: 58, sev: "low" },
  { x: 215, y: 142, sev: "med" },
  { x: 248, y: 120, sev: "high" },
  { x: 264, y: 134, sev: "high" },
];

const COLOR = {
  high: "#d34b4b",
  med: "#d8a034",
  low: "#bfc3c9",
} as const;

export function FailureHeatmap() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 360 300" width="100%" height="100%" fill="none" role="img"
      aria-label="Failure heatmap across ground friction and step height. High-severity failure clusters concentrate at low friction with high step height, and at high commanded velocity.">
      {/* frame */}
      <path d="M44 16 V 256 H 332" stroke="#bfc3c9" strokeWidth="1" opacity="0.6" />
      {/* axis ticks */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`x${i}`}>
          <path d={`M${44 + i * 48} 256 v 5`} stroke="#bfc3c9" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={`y${i}`} d={`M44 ${256 - i * 48} h -5`} stroke="#bfc3c9" strokeWidth="1" opacity="0.5" />
      ))}

      {/* contour isolines (success → failure transition) */}
      <g stroke="#d8dde5" strokeWidth="1" opacity="0.25">
        <path d="M44 210 C 120 200, 150 150, 250 150 S 332 120, 332 120" />
        <path d="M44 180 C 120 170, 150 120, 250 120 S 332 96, 332 96" />
        <path d="M44 150 C 120 140, 150 96, 250 96 S 332 72, 332 72" fill="none" />
      </g>
      {/* boundary isoline (the live edge) */}
      <path d="M44 200 C 130 190, 160 130, 260 130 S 332 104, 332 104"
        stroke="#f4f2ec" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.8" />
      <text x="250" y="200" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="10" opacity="0.7">
        failure boundary
      </text>

      {/* failure marks */}
      {FAILURES.map((f, i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduce ? 0 : 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${f.x}px ${f.y}px` }}
        >
          {f.sev === "high" ? (
            <path
              d={`M${f.x} ${f.y - 4.5} L ${f.x + 4.5} ${f.y} L ${f.x} ${f.y + 4.5} L ${f.x - 4.5} ${f.y} Z`}
              fill={COLOR.high}
            />
          ) : (
            <circle cx={f.x} cy={f.y} r={f.sev === "med" ? 3.4 : 2.6} fill={COLOR[f.sev as "med" | "low"]} />
          )}
        </motion.g>
      ))}

      {/* axis labels */}
      <text x="44" y="284" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="11">
        ground_friction →
      </text>
      <text x="332" y="284" textAnchor="end" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="11" opacity="0.7">
        1.40
      </text>
      <text
        x="20"
        y="140"
        fill="#bfc3c9"
        fontFamily="var(--font-mono)"
        fontSize="11"
        transform="rotate(-90 20 140)"
      >
        step_height →
      </text>
    </svg>
  );
}
