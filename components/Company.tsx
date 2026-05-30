import { Reveal } from "./Reveal";

const PRINCIPLES = [
  ["Evidence over theater", "Better evidence, not safety claims. Every report shows versions, seeds and envelope; risk scores state whether real-world calibration was used."],
  ["A growing failure library", "Every run produces structured parameter-failure data. Clusters transfer across policies and domains while customer IP stays private."],
  ["Honest about the gap", "We separate simulator-consistent failures from validated real-world failures, and never claim simulator agreement proves deployment safety."],
];

export function Company() {
  return (
    <section id="company" className="section s-graphite grid-bg">
      <span className="section-index">09 / company</span>
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Inoki Labs</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="h-section" style={{ maxWidth: 18 + "ch", marginTop: 20, marginBottom: 24 }}>
            Reliability infrastructure for physical AI.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="lede" style={{ maxWidth: "64ch" }}>
            BreakPoint is being built to find and fix the long-tail failures that decide
            whether robot policies survive deployment — turning simulation from broad random
            testing into targeted failure discovery, risk ranking, and retraining data.
          </p>
        </Reveal>

        <div className="divider" style={{ margin: "clamp(40px,5vw,64px) 0" }} />

        <div className="plat-grid">
          {PRINCIPLES.map(([h, p], i) => (
            <Reveal key={h} delay={0.05 + i * 0.06}>
              <div>
                <div className="num" style={{ color: "var(--silver)", fontSize: 12, marginBottom: 14 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontSize: 21, marginBottom: 12 }}>{h}</h3>
                <p style={{ color: "var(--silver)", fontSize: 15 }}>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
