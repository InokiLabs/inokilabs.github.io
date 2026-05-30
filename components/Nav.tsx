"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#workflow", label: "Workflow" },
  { href: "#instrument", label: "Product" },
  { href: "#mvp", label: "MVP" },
  { href: "#company", label: "Company" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="nav"
      style={
        solid
          ? { background: "rgba(5,5,5,0.82)", borderBottom: "1px solid var(--line-dim)" }
          : undefined
      }
    >
      <a className="brand" href="#top" aria-label="Inoki Labs — BreakPoint, back to top">
        <BrandMark size={22} className="brand-mark" />
        <span>
          Inoki Labs
          <span
            className="mono"
            style={{ color: "var(--silver)", fontSize: 11, marginLeft: 9, letterSpacing: "0.18em" }}
          >
            BREAKPOINT
          </span>
        </span>
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} className="nav-link" href={l.href}>
            {l.label}
          </a>
        ))}
        <a className="btn nav-cta" href="#pilot" style={{ padding: "10px 16px" }}>
          Request a pilot
        </a>
      </div>
    </nav>
  );
}
