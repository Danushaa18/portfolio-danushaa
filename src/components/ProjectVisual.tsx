import type { Project } from "@/content/site";

/**
 * Line-drawn schematics of what each project actually does, built only from
 * the resume's description. Strokes marked `.draw` are traced in on scroll.
 */
export function ProjectVisual({ kind, title }: { kind: Project["visual"]; title: string }) {
  const common = {
    className: `pv pv--${kind}`,
    role: "img" as const,
    "aria-label": `Schematic of ${title}`,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (kind) {
    case "hub": {
      const sources = [
        { y: 80, label: "Sales" },
        { y: 210, label: "HRMS" },
        { y: 340, label: "Meta Ads / Google Ads" },
      ];
      const modules = ["Marketing analytics", "Finance", "HRMS modules", "Role-based access", "Scorecards & KPIs"];
      return (
        <svg viewBox="0 0 640 420" {...common}>
          {sources.map((s) => (
            <g key={s.label}>
              <rect className="pv-node" x="20" y={s.y - 7} width="14" height="14" />
              <text className="pv-label" x="46" y={s.y + 5}>
                {s.label}
              </text>
              <path className="pv-line draw" d={`M 34 ${s.y} C 180 ${s.y}, 190 210, 268 210`} />
            </g>
          ))}
          <rect className="pv-core draw" x="268" y="170" width="120" height="80" />
          <text className="pv-core-label" x="328" y="216" textAnchor="middle">
            GGM-CRM
          </text>
          {modules.map((m, i) => {
            const y = 50 + i * 80;
            return (
              <g key={m}>
                <path className="pv-line pv-line--out draw" d={`M 388 210 C 440 210, 440 ${y}, 480 ${y}`} />
                <circle className="pv-dot" cx="484" cy={y} r="4" />
                <text className="pv-label" x="496" y={y + 4}>
                  {m}
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    case "site":
      return (
        <svg viewBox="0 0 560 420" {...common}>
          <rect className="pv-frame draw" x="30" y="30" width="420" height="330" />
          <path className="pv-line draw" d="M 30 190 H 450 M 250 30 V 190" />
          <text className="pv-label" x="50" y="64">Site operations</text>
          <text className="pv-label" x="270" y="64">Attendance</text>
          <circle className="pv-face draw" cx="350" cy="120" r="34" />
          <path className="pv-face-scan draw" d="M 306 120 H 394" />
          <text className="pv-caption" x="270" y="176">face recognition</text>
          <text className="pv-label" x="50" y="224">Procurement</text>
          <path className="pv-line draw" d="M 60 270 H 160 M 160 270 l -8 -6 m 8 6 l -8 6" />
          <text className="pv-caption" x="60" y="296">material request</text>
          <path className="pv-line draw" d="M 220 270 H 320 M 320 270 l -8 -6 m 8 6 l -8 6" />
          <text className="pv-caption" x="220" y="296">purchase</text>
          <ellipse className="pv-store draw" cx="505" cy="250" rx="34" ry="10" />
          <path className="pv-store draw" d="M 471 250 V 320 A 34 10 0 0 0 539 320 V 250" />
          <path className="pv-line pv-line--dash draw" d="M 450 250 H 471" />
          <text className="pv-caption" x="470" y="350">Cloud Storage</text>
          <path className="pv-dim" d="M 30 385 H 450 M 30 379 V 391 M 450 379 V 391" />
          <text className="pv-caption pv-caption--blue" x="240" y="405" textAnchor="middle">one platform per site</text>
        </svg>
      );

    case "direct":
      return (
        <svg viewBox="0 0 560 300" {...common}>
          <path className="pv-line pv-line--dash pv-line--muted draw" d="M 90 200 Q 280 30 470 200" />
          <circle className="pv-cut" cx="280" cy="115" r="22" />
          <path className="pv-x" d="M 264 99 L 296 131 M 296 99 L 264 131" />
          <text className="pv-caption pv-caption--red" x="280" y="78" textAnchor="middle">intermediary</text>
          <path className="pv-line pv-line--hot draw" d="M 112 200 H 448" />
          <circle className="pv-node-c" cx="90" cy="200" r="22" />
          <circle className="pv-node-c" cx="470" cy="200" r="22" />
          <text className="pv-label" x="90" y="250" textAnchor="middle">Farmer</text>
          <text className="pv-label" x="470" y="250" textAnchor="middle">Buyer</text>
          <text className="pv-caption" x="280" y="226" textAnchor="middle">direct, real time</text>
        </svg>
      );

    case "timeline": {
      const ticks = Array.from({ length: 9 }, (_, i) => i);
      const px = (min: number) => 40 + min * 60;
      return (
        <svg viewBox="0 0 560 260" {...common}>
          <path className="pv-line draw" d={`M ${px(0)} 120 H ${px(8)}`} />
          {ticks.map((t) => (
            <g key={t}>
              <path className="pv-dim" d={`M ${px(t)} 112 V 128`} />
              <text className="pv-caption" x={px(t)} y="150" textAnchor="middle">{t}m</text>
            </g>
          ))}
          <rect className="pv-off" x={px(1)} y="90" width={px(5) - px(1)} height="20" />
          <text className="pv-caption" x={px(1)} y="80">screen off</text>
          <path className="pv-threshold draw" d={`M ${px(4)} 60 V 180`} />
          <text className="pv-caption pv-caption--red" x={px(4) + 8} y="196">over 3 min: ask for a reason</text>
          <path className="pv-line pv-line--dash draw" d={`M ${px(4)} 210 Q ${px(4)} 236 ${px(6)} 236 H ${px(7)}`} />
          <text className="pv-label" x={px(7) + 8} y="240">HR report</text>
          <text className="pv-caption pv-caption--blue" x="40" y="30">illustrative timeline</text>
        </svg>
      );
    }

    case "track":
      return (
        <svg viewBox="0 0 560 240" {...common}>
          <path className="pv-line draw" d="M 60 120 C 160 40, 220 200, 280 120 S 420 40, 500 120" />
          {[
            { x: 60, label: "Lead" },
            { x: 280, label: "Interactions" },
            { x: 500, label: "Conversion" },
          ].map((s) => (
            <g key={s.label}>
              <circle className="pv-node-c" cx={s.x} cy="120" r="12" />
              <text className="pv-label" x={s.x} y="176" textAnchor="middle">{s.label}</text>
            </g>
          ))}
        </svg>
      );
  }
}
