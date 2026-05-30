"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

const SIMS = ["Isaac Lab", "MuJoCo MJX", "Genesis"] as const;
type Sim = (typeof SIMS)[number];

type Repro = "yes" | "no" | "artifact";
const ROWS: { id: string; cells: Record<Sim, Repro>; tier: "high" | "med" | "low" | "calib" }[] = [
  { id: "cluster_01", cells: { "Isaac Lab": "yes", "MuJoCo MJX": "yes", Genesis: "yes" }, tier: "high" },
  { id: "cluster_02", cells: { "Isaac Lab": "yes", "MuJoCo MJX": "yes", Genesis: "yes" }, tier: "high" },
  { id: "cluster_03", cells: { "Isaac Lab": "yes", "MuJoCo MJX": "yes", Genesis: "no" }, tier: "med" },
  { id: "cluster_05", cells: { "Isaac Lab": "yes", "MuJoCo MJX": "no", Genesis: "no" }, tier: "calib" },
  { id: "cluster_07", cells: { "Isaac Lab": "yes", "MuJoCo MJX": "no", Genesis: "artifact" }, tier: "low" },
];

function Mark({ r }: { r: Repro }) {
  if (r === "yes")
    return (
      <span className="cell-mark" style={{ color: "var(--verified-green)" }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7.5 L 6 11 L 12 3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        reproduced
      </span>
    );
  if (r === "artifact")
    return (
      <span className="cell-mark" style={{ color: "var(--silver)" }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" />
        </svg>
        artifact
      </span>
    );
  return (
    <span className="cell-mark" style={{ color: "rgba(5,5,5,0.35)" }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7 H 11" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      not seen
    </span>
  );
}

const TIER_LABEL = {
  high: { cls: "risk-high", t: "high" },
  med: { cls: "risk-med", t: "medium" },
  low: { cls: "risk-low", t: "low · artifact" },
  calib: { cls: "risk-med", t: "needs calibration" },
} as const;

export function SimToReal() {
  const [focus, setFocus] = useState<Sim>("MuJoCo MJX");

  return (
    <section id="risk" className="section s-dark grid-bg">
      <span className="section-index">05 / sim-to-real</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">Calibration sheet</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">Replay across simulators. Separate real risk from artifact.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              A failure in one simulator may be a real risk or a solver artifact. BreakPoint
              replays cluster centroids across backends and reports a ranked risk signal — it
              never claims simulator agreement proves real-world safety.
            </p>
          </Reveal>
        </div>

        <div className="cal-sheet">
        <Reveal delay={0.05}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
            <span className="tag" style={{ textTransform: "uppercase", letterSpacing: "0.18em" }}>
              cross-check against
            </span>
            <div className="seg" role="group" aria-label="Secondary simulator focus">
              {SIMS.map((s) => (
                <button key={s} aria-pressed={focus === s} onClick={() => setFocus(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ overflowX: "auto" }}>
            <table className="matrix">
              <caption className="sr-only">
                Cross-simulator reproduction of failure clusters across Isaac Lab, MuJoCo MJX and Genesis, with resulting risk tier.
              </caption>
              <thead>
                <tr>
                  <th scope="col">failure cluster</th>
                  {SIMS.map((s) => (
                    <th key={s} scope="col" style={focus === s ? { color: "var(--ink-black)", background: "rgba(5,5,5,0.05)" } : undefined}>
                      {s}
                    </th>
                  ))}
                  <th scope="col">risk tier</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{row.id}</th>
                    {SIMS.map((s) => (
                      <td key={s} style={focus === s ? { background: "rgba(5,5,5,0.035)" } : undefined}>
                        <Mark r={row.cells[s]} />
                      </td>
                    ))}
                    <td>
                      <span className={`risk ${TIER_LABEL[row.tier].cls}`}>
                        <span className="dot" aria-hidden="true" />
                        {TIER_LABEL[row.tier].t}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="form-note" style={{ color: "var(--silver)", marginTop: 18 }}>
            Every report ships simulator version, policy version, seed strategy and parameter
            envelope. Risk scores state whether real-world calibration was used.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
