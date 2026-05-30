"use client";

import { Reveal, RevealGroup, itemVariants } from "./Reveal";
import { motion } from "motion/react";

const STEPS = [
  { n: "01", t: "Search", d: "Massive parallel sweeps over a declared operational envelope, steered toward the failure boundary." },
  { n: "02", t: "Cluster", d: "Failed rollouts grouped into interpretable modes with parameter ranges and trajectory signatures." },
  { n: "03", t: "Score", d: "Clusters cross-checked across simulators and ranked for sim-to-real risk." },
  { n: "04", t: "Generate", d: "Stage-ordered curriculum distributions built around each high-risk failure mode." },
  { n: "05", t: "Retrain", d: "Targeted data feeds standard pipelines, or runs a retraining loop in-house." },
  { n: "06", t: "Re-test", d: "Discovery reruns on the improved policy to measure how the boundary moved." },
];

export function Workflow() {
  return (
    <section id="workflow" className="section s-dark grid-bg">
      <span className="section-index">03 / workflow</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">A disciplined engineering loop</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">
              Simulation as targeted discovery — not broad random testing.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              BreakPoint closes the loop from failure discovery to retraining data and
              back, so every run measures the policy against the exact conditions that
              break it.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="flow-rail" />
        </Reveal>
        <RevealGroup className="flow" stagger={0.08}>
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={itemVariants} className="flow-node">
              <span className="flow-dot" aria-hidden="true" />
              <span className="flow-num">{s.n}</span>
              <h3 className="flow-title">{s.t}</h3>
              <p className="flow-desc">{s.d}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
