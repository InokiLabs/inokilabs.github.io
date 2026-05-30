"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

const NODES = [
  { id: 1, x: 90, y: 150, label: "boundary\nwarmup", risk: "low" },
  { id: 2, x: 290, y: 90, label: "core\nfailure", risk: "high" },
  { id: 3, x: 290, y: 220, label: "recovery", risk: "high" },
  { id: 4, x: 500, y: 150, label: "bridge", risk: "med" },
  { id: 5, x: 700, y: 90, label: "held-out\neval", risk: "low" },
  { id: 6, x: 700, y: 220, label: "nominal\nguardrail", risk: "low" },
];

const EDGES = [
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [4, 5],
  [1, 6],
];

const RISK_STROKE = {
  high: "#d34b4b",
  med: "#d8a034",
  low: "#bfc3c9",
} as const;

export function Curriculum() {
  const reduce = useReducedMotion();
  const nodeById = (id: number) => NODES.find((n) => n.id === id)!;

  return (
    <section id="curriculum" className="section s-dark grid-bg">
      <span className="section-index">06 / curriculum</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">Failure-driven curriculum DAG</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">From near-success boundaries to hard bridge cases.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              High and medium-risk clusters become stage-ordered training distributions.
              Held-out variants detect overfitting; a nominal guardrail catches regression.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="panel" style={{ padding: "clamp(20px,3vw,40px)" }}>
            <svg viewBox="0 0 800 320" className="dag" role="img"
              aria-label="Curriculum DAG: boundary warmup feeds core failure and recovery stages, which converge into a bridge stage, then a held-out evaluation stage; a nominal guardrail branches from warmup.">
              {/* edges */}
              {EDGES.map(([a, b], i) => {
                const na = nodeById(a);
                const nb = nodeById(b);
                const d = `M${na.x + 38} ${na.y} C ${na.x + 120} ${na.y}, ${nb.x - 120} ${nb.y}, ${nb.x - 38} ${nb.y}`;
                return (
                  <motion.path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="#bfc3c9"
                    strokeWidth="1.2"
                    opacity="0.5"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={reduce ? undefined : { pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                );
              })}
              {/* nodes */}
              {NODES.map((n, i) => (
                <motion.g
                  key={n.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                >
                  <circle cx={n.x} cy={n.y} r="34" fill="#0c0d0f" stroke={RISK_STROKE[n.risk as keyof typeof RISK_STROKE]} strokeWidth="1.4" />
                  <circle cx={n.x} cy={n.y} r="34" fill="none" stroke="#f4f2ec" strokeWidth="0.6" opacity="0.25" />
                  <text x={n.x} y={n.y - 38} textAnchor="middle" fill="#bfc3c9" fontFamily="var(--font-mono)" fontSize="11">
                    stage_{n.id}
                  </text>
                  {n.label.split("\n").map((line, li, arr) => (
                    <text
                      key={li}
                      x={n.x}
                      y={n.y + (li - (arr.length - 1) / 2) * 13 + 4}
                      textAnchor="middle"
                      fill="#f4f2ec"
                      fontFamily="var(--font-display)"
                      fontSize="12.5"
                    >
                      {line}
                    </text>
                  ))}
                </motion.g>
              ))}
            </svg>

            <div className="dag-legend">
              {[
                ["high", "core / confirmed real risk → retrain"],
                ["med", "bridge / generalization"],
                ["low", "boundary, held-out, guardrail"],
              ].map(([k, v]) => (
                <span key={k} className="dag-legend-item">
                  <span style={{ width: 12, height: 12, borderRadius: 3, border: `1.4px solid ${RISK_STROKE[k as keyof typeof RISK_STROKE]}` }} />
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
