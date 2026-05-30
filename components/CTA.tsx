"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

const ROBOT_TYPES = ["Quadruped", "Humanoid", "AMR / mobile base", "Manipulator", "Other"];
const SIM_STACKS = ["Isaac Lab / Isaac Sim", "MuJoCo / MJX", "Genesis", "Internal simulator", "Not sure yet"];
const POLICY_FMTS = ["PyTorch checkpoint", "ONNX export", "JAX", "Other / internal"];

export function CTA() {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ robot: "", sim: "", policy: "", task: "", email: "" });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  const mailto = `mailto:pilots@inokilabs.dev?subject=${encodeURIComponent(
    "BreakPoint pilot request"
  )}&body=${encodeURIComponent(
    `Robot type: ${data.robot}\nSimulator stack: ${data.sim}\nPolicy format: ${data.policy}\nTarget task: ${data.task}\nContact: ${data.email}`
  )}`;

  return (
    <section id="pilot" className="section s-dark grid-bg">
      <span className="section-index">09 / pilot</span>
      <div className="wrap">
        <div className="cta-grid">
          <div>
            <Reveal>
              <span className="eyebrow">BreakPoint Pilot</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-section" style={{ marginTop: 20, marginBottom: 22 }}>
                Break your policy in simulation. Fix it before deployment.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">
                Send a policy, robot model and target task. We run a fixed-compute failure
                discovery job and return a failure report, rollout videos, risk-ranked
                clusters, and a retraining dataset.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 12 }}>
                {["Failure cluster map + example rollouts", "Risk-ranked cluster table", "RLDS-ready curriculum dataset", "Optional: retrain & measure boundary movement"].map((t) => (
                  <li key={t} style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--silver)" }}>
                    <span style={{ color: "var(--verified-green)" }}>+</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="panel panel--active">
              {sent ? (
                <div style={{ padding: "20px 4px" }}>
                  <div className="risk risk-verified" style={{ marginBottom: 16 }}>
                    <span className="dot" aria-hidden="true" /> request prepared
                  </div>
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>Ready to send.</h3>
                  <p style={{ color: "var(--silver)", fontSize: 15, marginBottom: 20 }}>
                    This is a static demo site, so the form doesn&apos;t post to a server. Use
                    the button below to open the pre-filled request in your mail client.
                  </p>
                  <a className="btn btn-primary" href={mailto}>
                    Open pilot request
                  </a>
                </div>
              ) : (
                <form onSubmit={onSubmit} aria-label="Request a BreakPoint pilot">
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="robot">Robot type</label>
                      <select id="robot" required value={data.robot} onChange={(e) => setData({ ...data, robot: e.target.value })}>
                        <option value="" disabled>select…</option>
                        {ROBOT_TYPES.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="sim">Simulator stack</label>
                      <select id="sim" required value={data.sim} onChange={(e) => setData({ ...data, sim: e.target.value })}>
                        <option value="" disabled>select…</option>
                        {SIM_STACKS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="policy">Policy format</label>
                      <select id="policy" required value={data.policy} onChange={(e) => setData({ ...data, policy: e.target.value })}>
                        <option value="" disabled>select…</option>
                        {POLICY_FMTS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="task">Target task</label>
                      <input id="task" type="text" placeholder="rough-terrain locomotion" required value={data.task} onChange={(e) => setData({ ...data, task: e.target.value })} />
                    </div>
                  </div>
                  <div className="field" style={{ marginBottom: 20 }}>
                    <label htmlFor="email">Work email</label>
                    <input id="email" type="email" placeholder="you@company.com" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Request a pilot
                  </button>
                  <p className="form-note">
                    Customer policies and robot assets are treated as confidential IP.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
