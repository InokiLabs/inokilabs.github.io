type Line = { kind?: "tk" | "ok" | "warn" | "err"; label?: string; text: string };

const DEFAULT_LINES: Line[] = [
  { kind: "tk", label: "$", text: "breakpoint run go2-rough-terrain --budget 10000" },
  { kind: "tk", label: "[search]", text: "10,000 variants evaluated · 4096 envs/step" },
  { kind: "tk", label: "[cluster]", text: "7 failure modes found" },
  { kind: "err", label: "[risk]", text: "3 high-priority clusters" },
  { kind: "warn", label: "[risk]", text: "2 medium · physics-model dependent" },
  { kind: "ok", label: "[export]", text: "30,000 targeted curriculum episodes" },
];

export function Terminal({
  lines = DEFAULT_LINES,
  title = "instrument · run log",
  cursor = true,
}: {
  lines?: Line[];
  title?: string;
  cursor?: boolean;
}) {
  return (
    <div className="terminal" role="img" aria-label="BreakPoint run log: 10,000 variants evaluated, 7 failure modes found, 3 high-priority clusters, 30,000 curriculum episodes exported.">
      <div className="terminal-bar" aria-hidden="true">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span style={{ marginLeft: 8 }}>{title}</span>
      </div>
      <div className="terminal-body" aria-hidden="true">
        {lines.map((l, i) => (
          <div className="terminal-line" key={i}>
            <span className={l.kind ?? "tk"} style={{ marginRight: 10 }}>
              {l.label}
            </span>
            <span style={{ color: "var(--pearl-white)" }}>{l.text}</span>
          </div>
        ))}
        {cursor && (
          <div className="terminal-line">
            <span className="tk" style={{ marginRight: 10 }}>
              $
            </span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
