"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroScene } from "./HeroScene";

const WORKFLOW = ["Search", "Cluster", "Score", "Generate", "Retrain", "Re-test"];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <header id="top" className="section s-dark grid-bg hero">
      <div className="hero-figure" aria-hidden={false}>
        <HeroScene />
        {/* pearlescent light sweep — crosses the figure once on load */}
        {!reduce && (
          <motion.div
            className="hero-sweep"
            initial={{ x: "-40%", opacity: 0 }}
            animate={{ x: "140%", opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>

      <div className="wrap hero-inner">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hero-copy"
        >
          <span className="eyebrow">Adversarial simulation · physical AI reliability</span>

          <h1 className="h-display hero-title">
            Break<span className="hero-title-accent">Point</span>
          </h1>

          <p className="hero-headline">
            Find the edge cases before the robot does.
          </p>
          <p className="lede hero-sub">
            Adversarial simulation that finds robot policy failures and turns them
            into targeted retraining data.
          </p>

          <div className="hero-cta">
            <a className="btn btn-primary" href="#pilot">
              Request a pilot
            </a>
            <a className="btn" href="#mvp">
              View the MVP plan
            </a>
          </div>
        </motion.div>
      </div>

      {/* compact workflow strip peeking into view */}
      <motion.div
        className="hero-strip wrap"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="tag hero-strip-label">closed loop</span>
        <ol className="hero-strip-steps">
          {WORKFLOW.map((step, i) => (
            <li key={step} className="hero-strip-step">
              <span className="num hero-strip-idx">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
              {i < WORKFLOW.length - 1 && <span className="hero-strip-arrow">→</span>}
            </li>
          ))}
        </ol>
      </motion.div>

      <span className="reg-mark" style={{ top: 96, left: 28, color: "var(--silver)" }} />
      <span className="reg-mark" style={{ bottom: 130, right: 28, color: "var(--silver)" }} />
    </header>
  );
}
