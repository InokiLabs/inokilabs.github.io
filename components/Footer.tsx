import { BrandMark } from "./BrandMark";

const COLS = [
  {
    h: "Product",
    links: [
      ["Failure discovery", "#instrument"],
      ["Sim-to-real scoring", "#risk"],
      ["Curriculum export", "#curriculum"],
      ["MVP plan", "#mvp"],
    ],
  },
  {
    h: "Platform",
    links: [
      ["Isaac Lab", "#platform"],
      ["MuJoCo MJX", "#platform"],
      ["Policy adapters", "#platform"],
      ["RLDS export", "#platform"],
    ],
  },
  {
    h: "Company",
    links: [
      ["Mission", "#company"],
      ["Request a pilot", "#pilot"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div style={{ maxWidth: 320 }}>
            <div className="brand" style={{ marginBottom: 16 }}>
              <BrandMark size={22} className="brand-mark" />
              <span>Inoki Labs</span>
            </div>
            <p style={{ color: "var(--silver)", fontSize: 14, lineHeight: 1.6 }}>
              The failure-discovery engine for physical AI. Find robot policy failures in
              simulation and turn them into targeted retraining data.
            </p>
          </div>
          <div className="footer-cols">
            {COLS.map((c) => (
              <div key={c.h} className="footer-col">
                <h4>{c.h}</h4>
                {c.links.map(([l, href]) => (
                  <a key={l} href={href}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Inoki Labs · BreakPoint</span>
          <span>Pre-deployment robustness layer · not a safety certification system.</span>
        </div>
      </div>
    </footer>
  );
}
