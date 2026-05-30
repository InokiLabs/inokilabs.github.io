"use client";

import { Reveal, RevealGroup, itemVariants } from "./Reveal";
import { motion } from "motion/react";

const CARDS = [
  {
    h: "Simulator backends",
    p: "High-throughput search in Isaac Lab; cross-simulator confirmation in MuJoCo MJX; broader physics diversity via Genesis as embodiment and task stabilize.",
    tags: ["Isaac Lab", "MuJoCo MJX", "Genesis"],
  },
  {
    h: "Policy adapters",
    p: "A common inference interface over customer policies — observation/action normalization, action bounds and rate limits, recurrent-state handling.",
    tags: ["PyTorch", "ONNX", "JAX", "RSL-RL"],
  },
  {
    h: "Dataset export",
    p: "Schema preserves episode, parameter, failure-cluster and curriculum metadata, mapping into standard robot-learning pipelines.",
    tags: ["RLDS-ready", "Parquet / JSONL", "Diffusion Policy", "ACT", "GR00T"],
  },
];

export function Platform() {
  return (
    <section id="platform" className="section s-dark grid-bg">
      <span className="section-index">08 / platform</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">Built on the stack robot teams already use</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">Integrates with your simulators and training pipelines.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              BreakPoint builds on GPU-parallel simulation rather than replacing it — a
              pre-deployment robustness layer, not a new training framework.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="plat-grid" stagger={0.1}>
          {CARDS.map((c) => (
            <motion.article key={c.h} variants={itemVariants} className="plat-card">
              <h3>{c.h}</h3>
              <p>{c.p}</p>
              <div className="plat-tags">
                {c.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
