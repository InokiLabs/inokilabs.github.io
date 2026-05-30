"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Terminal } from "./Terminal";

type TabId = "discovery" | "risk" | "curriculum";

const TABS: { id: TabId; label: string }[] = [
  { id: "discovery", label: "Failure Discovery" },
  { id: "risk", label: "Risk Scoring" },
  { id: "curriculum", label: "Curriculum Export" },
];

const CLUSTERS = [
  { id: "cluster_01", label: "low-friction diagonal step-down fall", sig: "μ 0.20–0.36 · step 0.18–0.29 m", n: 183, tier: "high" as const },
  { id: "cluster_02", label: "actuator-delay yaw-correction stumble", sig: "delay 48–80 ms · v 1.4–1.8 m/s", n: 119, tier: "high" as const },
  { id: "cluster_03", label: "high-step toe-catch stall", sig: "step 0.24–0.31 m · payload 1.8 kg", n: 96, tier: "med" as const },
  { id: "cluster_07", label: "restitution rebound", sig: "restitution 0.18 · isaac-only", n: 24, tier: "low" as const },
];

const RISK_ROWS = [
  { id: "cluster_01", agree: "3 / 3", sev: "0.94", plaus: "high", score: 0.91, tier: "high" as const },
  { id: "cluster_02", agree: "3 / 3", sev: "0.88", plaus: "high", score: 0.86, tier: "high" as const },
  { id: "cluster_03", agree: "2 / 3", sev: "0.72", plaus: "med", score: 0.61, tier: "med" as const },
  { id: "cluster_07", agree: "1 / 3", sev: "0.41", plaus: "low", score: 0.22, tier: "low" as const },
];

const STAGES = [
  { n: "1", name: "Boundary warmup", w: "near-success variants just inside the edge" },
  { n: "2", name: "Core failure", w: "high-risk cluster centroids, severity-weighted" },
  { n: "3", name: "Recovery", w: "force regain of stable gait after perturbation" },
  { n: "4", name: "Bridge", w: "mixed variants between adjacent clusters" },
  { n: "5", name: "Held-out eval", w: "same family, never trained on" },
  { n: "6", name: "Nominal guardrail", w: "normal envs to catch regression" },
];

function RiskPill({ tier }: { tier: "high" | "med" | "low" }) {
  const map = {
    high: { cls: "risk-high", label: "high" },
    med: { cls: "risk-med", label: "medium" },
    low: { cls: "risk-low", label: "low" },
  } as const;
  const m = map[tier];
  return (
    <span className={`risk ${m.cls}`}>
      <span className="dot" aria-hidden="true" />
      {m.label}
    </span>
  );
}

export function Instrument() {
  const [tab, setTab] = useState<TabId>("discovery");

  return (
    <section id="instrument" className="section s-pearl grid-bg">
      <span className="section-index">04 / product</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">Product evidence, not ornament</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">A robustness data engine you can read like an instrument.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              Every run produces the same artifact chain: a failure map, a risk-ranked
              cluster table, and a curriculum-ordered dataset. Switch surfaces below.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="instrument">
            <div className="instrument-bar" role="tablist" aria-label="Product surfaces">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  className="instrument-tab"
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
              <span className="instrument-meta" aria-hidden="true">
                <span>policy: go2-rough-v3</span>
                <span>sim: isaac_lab</span>
              </span>
            </div>

            {/* ----- Failure Discovery ----- */}
            {tab === "discovery" && (
              <div className="instrument-body" role="tabpanel" id="panel-discovery" aria-labelledby="tab-discovery">
                <div className="instrument-stage">
                  <span className="tag" style={{ display: "block", marginBottom: 10 }}>
                    discovered failure clusters
                  </span>
                  {CLUSTERS.map((c) => (
                    <div key={c.id} className="cluster-row">
                      <div>
                        <div className="cluster-id">{c.id}</div>
                        <div className="cluster-sig">{c.label}</div>
                        <div className="cluster-sig" style={{ opacity: 0.7 }}>{c.sig}</div>
                      </div>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <RiskPill tier={c.tier} />
                        <span className="num" style={{ fontSize: 11, color: "var(--silver)" }}>
                          {c.n} eps
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="instrument-side">
                  <span className="tag">run summary</span>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
                    {[
                      ["10,000", "variants evaluated"],
                      ["7", "failure modes found"],
                      ["3", "high-priority clusters"],
                    ].map(([v, l], i) => (
                      <li
                        key={l}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          padding: "14px 0",
                          borderBottom: i < 2 ? "1px solid var(--line-dim)" : "none",
                        }}
                      >
                        <span
                          className="num"
                          style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--ceramic-white)" }}
                        >
                          {v}
                        </span>
                        <span className="tag">{l}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="tag" style={{ lineHeight: 1.6, marginTop: 6 }}>
                    Each cluster carries its parameter signature, severity, and example
                    rollouts. Risk tiers come from the scoring surface.
                  </p>
                </div>
              </div>
            )}

            {/* ----- Risk Scoring ----- */}
            {tab === "risk" && (
              <div className="instrument-body" role="tabpanel" id="panel-risk" aria-labelledby="tab-risk">
                <div className="instrument-stage">
                  <table className="rtable">
                    <thead>
                      <tr>
                        <th>cluster</th>
                        <th>sim agree</th>
                        <th>severity</th>
                        <th>plausibility</th>
                        <th>risk_score</th>
                        <th>tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RISK_ROWS.map((r) => (
                        <tr key={r.id}>
                          <td style={{ color: "var(--ceramic-white)" }}>{r.id}</td>
                          <td>{r.agree}</td>
                          <td>{r.sev}</td>
                          <td>{r.plaus}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className="score-bar" aria-hidden="true">
                                <span style={{ width: `${r.score * 100}%` }} />
                              </div>
                              <span className="num">{r.score.toFixed(2)}</span>
                            </div>
                          </td>
                          <td>
                            <RiskPill tier={r.tier} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="instrument-side">
                  <span className="tag">score composition</span>
                  <p style={{ fontSize: 14, color: "var(--silver)", margin: 0 }}>
                    A weighted signal — never simulator count alone. Severity, operational
                    plausibility and boundary stability all enter the score.
                  </p>
                  <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0, display: "grid", gap: 10 }}>
                    {[
                      ["simulator_agreement", "0.30"],
                      ["severity", "0.25"],
                      ["operational_plausibility", "0.20"],
                      ["cluster_support_confidence", "0.15"],
                      ["boundary_stability", "0.10"],
                    ].map(([k, v]) => (
                      <li key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--pearl-white)" }}>
                        <span style={{ color: "var(--silver)" }}>{k}</span>
                        <span className="num">{v}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="tag" style={{ marginTop: 4, lineHeight: 1.6 }}>
                    Low-risk clusters stay visible, flagged as likely simulator artifacts —
                    not silently discarded.
                  </p>
                </div>
              </div>
            )}

            {/* ----- Curriculum Export ----- */}
            {tab === "curriculum" && (
              <div className="instrument-body" role="tabpanel" id="panel-curriculum" aria-labelledby="tab-curriculum">
                <div className="instrument-stage">
                  <span className="tag" style={{ marginBottom: 14, display: "block" }}>
                    curriculum DAG · stage order
                  </span>
                  <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 0 }}>
                    {STAGES.map((s, i) => (
                      <li key={s.n} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 14, padding: "13px 0", borderBottom: i < STAGES.length - 1 ? "1px solid var(--line-dim)" : "none" }}>
                        <span className="num" style={{ fontSize: 13, color: "var(--ceramic-white)", border: "1px solid var(--line-mid)", borderRadius: 4, width: 30, height: 30, display: "grid", placeItems: "center" }}>
                          {s.n}
                        </span>
                        <span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 17, display: "block" }}>{s.name}</span>
                          <span className="tag">{s.w}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="instrument-side">
                  <span className="tag">export</span>
                  <Terminal
                    cursor={false}
                    title="export · go2-rough-terrain"
                    lines={[
                      { kind: "ok", label: "[export]", text: "30,000 curriculum episodes" },
                      { kind: "tk", label: "  ·", text: "RLDS-ready TFRecords" },
                      { kind: "tk", label: "  ·", text: "Parquet step metadata" },
                      { kind: "tk", label: "  ·", text: "Isaac Lab native configs" },
                    ]}
                  />
                  <p className="tag" style={{ lineHeight: 1.6 }}>
                    Schema preserves episode, parameter, failure-cluster and curriculum-stage
                    metadata — ready for Diffusion Policy, ACT, and GR00T pipelines.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
