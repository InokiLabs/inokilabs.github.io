import { Reveal } from "./Reveal";
import { Terminal } from "./Terminal";

const SPECS = [
  ["Robot", "Unitree Go2 · Isaac Lab USD, MJCF translation for MJX"],
  ["Policy", "RSL-RL locomotion checkpoint · PyTorch / ONNX export"],
  ["Task", "Velocity tracking · rough-terrain traversal"],
  ["Envelope", "Slope, step, friction, payload, actuator delay, sensing noise"],
  ["Search", "10k–50k terrain & dynamics variations, Sobol → Bayesian"],
  ["Validation", "Cluster centroids replayed in ≥ 1 second simulator (MJX)"],
];

const METRICS = [
  ["10k–50k", "variations searched"],
  ["≥ 3", "distinct failure clusters"],
  ["2 / 3", "high-risk reproduced"],
  ["0", "nominal regression target"],
];

function BeforeAfter() {
  return (
    <svg viewBox="0 0 420 280" width="100%" height="100%" fill="none" role="img"
      aria-label="Expected before/after robustness. Baseline success drops sharply as environment difficulty rises; the retrained policy holds success further out, shifting the failure boundary to harder conditions.">
      <defs>
        <linearGradient id="liftFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fae7a" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7fae7a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="afterStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#050505" />
          <stop offset="0.6" stopColor="#7fae7a" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
      </defs>
      {/* axes */}
      <path d="M48 20 V 232 H 404" stroke="rgba(5,5,5,0.4)" strokeWidth="1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M48 ${232 - i * 48} h -5`} stroke="rgba(5,5,5,0.3)" strokeWidth="1" />
      ))}
      {/* lift region between curves */}
      <path
        d="M48 60 C 150 64, 200 80, 250 150 C 280 200, 320 222, 404 226 L 404 226 C 320 222, 280 150, 250 96 C 210 56, 150 44, 48 44 Z"
        fill="url(#liftFill)"
      />
      {/* baseline (before) */}
      <path d="M48 60 C 150 64, 200 80, 250 150 C 280 200, 320 222, 404 226" stroke="#050505" strokeWidth="1.6" strokeDasharray="5 4" />
      {/* retrained (after) — boundary pushed right */}
      <path d="M48 44 C 150 44, 210 56, 250 96 C 280 150, 320 222, 404 226" stroke="url(#afterStroke)" strokeWidth="2" />
      {/* labels */}
      <text x="60" y="78" fill="#050505" fontFamily="var(--font-mono)" fontSize="11" opacity="0.7">baseline</text>
      <text x="120" y="38" fill="#5d8758" fontFamily="var(--font-mono)" fontSize="11">retrained</text>
      <text x="48" y="252" fill="rgba(5,5,5,0.55)" fontFamily="var(--font-mono)" fontSize="11">environment difficulty →</text>
      <text x="20" y="130" fill="rgba(5,5,5,0.55)" fontFamily="var(--font-mono)" fontSize="11" transform="rotate(-90 20 130)">success rate →</text>
    </svg>
  );
}

export function MVP() {
  return (
    <section id="mvp" className="section s-pearl grid-bg">
      <span className="section-index">07 / mvp</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">First wedge · Unitree Go2 locomotion</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">Prove targeted discovery beats broad randomization.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              The MVP demonstrates that targeted failure discovery plus retraining improves
              Go2 locomotion robustness more efficiently than broad domain randomization alone.
            </p>
          </Reveal>
        </div>

        <div className="mvp-grid">
          <Reveal>
            <ul className="spec-list">
              {SPECS.map(([k, v]) => (
                <li key={k} className="spec-row">
                  <span className="spec-key">{k}</span>
                  <span className="spec-val">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="panel" style={{ background: "rgba(255,255,255,0.55)" }}>
              <span className="tag" style={{ display: "block", marginBottom: 10 }}>
                expected robustness lift · held-out failure set
              </span>
              <div style={{ aspectRatio: "420/280" }}>
                <BeforeAfter />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="metric-strip">
            {METRICS.map(([v, l]) => (
              <div key={l} className="metric">
                <div className="metric-val">{v}</div>
                <div className="metric-label">{l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="form-note" style={{ color: "rgba(5,5,5,0.5)", marginTop: 22 }}>
            Targets, not benchmarks. Throughput claims (e.g. variations per hour) are only
            published once measured on a specific policy, horizon, env count and GPU class.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
