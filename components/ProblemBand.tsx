import { Reveal } from "./Reveal";

const CASES = [
  {
    id: "low_friction",
    param: "ground_friction = 0.24",
    title: "Low friction",
    body: "A diagonal step-down onto a slick surface. Average-case gait holds; this exact combination slips and the base rolls past recovery.",
    fig: (
      <svg viewBox="0 0 220 96" fill="none" aria-hidden="true" width="100%" height="100%">
        <path d="M0 78 L 120 78 L 220 56" stroke="#050505" strokeWidth="1.4" />
        <path d="M120 78 L 220 56" stroke="#d34b4b" strokeWidth="1.4" strokeDasharray="4 4" />
        {[...Array(7)].map((_, i) => (
          <path key={i} d={`M${130 + i * 12} 78 l 6 -10`} stroke="#bfc3c9" strokeWidth="1" />
        ))}
        <text x="6" y="20" fill="#d34b4b" fontFamily="var(--font-mono)" fontSize="11">
          μ ↓ → slip
        </text>
      </svg>
    ),
  },
  {
    id: "step_transition",
    param: "step_height = 0.28 m",
    title: "Step transition",
    body: "A step height that lands near the policy's foot-clearance margin. Most heights clear cleanly; this band catches a toe and stumbles.",
    fig: (
      <svg viewBox="0 0 220 96" fill="none" aria-hidden="true" width="100%" height="100%">
        <path d="M0 78 L 110 78 L 110 44 L 220 44" stroke="#050505" strokeWidth="1.4" />
        <path d="M96 44 L 96 78 M90 44 L 102 44 M90 78 L 102 78" stroke="#d8a034" strokeWidth="1" />
        <text x="6" y="20" fill="#d8a034" fontFamily="var(--font-mono)" fontSize="11">
          clearance margin
        </text>
      </svg>
    ),
  },
  {
    id: "actuator_delay",
    param: "actuator_delay = 64 ms",
    title: "Actuator delay",
    body: "High commanded velocity plus actuator lag. The controller's correction arrives a beat late, compounding into a fall the nominal test never sees.",
    fig: (
      <svg viewBox="0 0 220 96" fill="none" aria-hidden="true" width="100%" height="100%">
        <path d="M0 48 H 220" stroke="#bfc3c9" strokeWidth="0.8" strokeDasharray="2 4" />
        <path d="M0 48 C 40 48, 50 18, 80 18 S 120 78, 160 78 S 200 30, 220 30" stroke="#050505" strokeWidth="1.4" />
        <path d="M0 48 C 56 48, 66 30, 96 30 S 136 66, 176 66 S 216 40, 232 40" stroke="#d34b4b" strokeWidth="1.2" strokeDasharray="4 4" />
        <text x="6" y="18" fill="#d34b4b" fontFamily="var(--font-mono)" fontSize="11">
          command
        </text>
        <text x="120" y="92" fill="#050505" fontFamily="var(--font-mono)" fontSize="11" opacity="0.6">
          response
        </text>
      </svg>
    ),
  },
];

export function ProblemBand() {
  return (
    <section id="problem" className="section s-pearl grid-bg">
      <span className="section-index">02 / problem</span>
      <div className="wrap">
        <div className="head-block">
          <Reveal>
            <span className="eyebrow">The tail, not the average</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-section">Average success hides tail failure.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede">
              Learned policies perform well on average and fail in narrow tails of the
              distribution — nonlinear interactions of terrain, friction, delay, payload
              and contact timing that no engineer can enumerate by hand.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="problem-grid">
            {CASES.map((c) => (
              <article key={c.id} className="problem-cell">
                <span className="tag mono">{c.param}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <div className="problem-fig">{c.fig}</div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
