/**
 * Bespoke editorial art panels for the Automation tracks.
 * Each panel is a distinct abstract composition — no icons, no clip-art.
 * Monochrome ink on soft canvas with a single restrained accent.
 */

type ArtProps = { className?: string };

export function AiWorkflowArt({ className = "" }: ArtProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Abstract diagram of an intelligence system"
    >
      <defs>
        <pattern id="ai-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M 16 0 L 0 0 0 16"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.5"
          />
        </pattern>
        <radialGradient id="ai-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="320" fill="url(#ai-grid)" />

      {/* Corner tick marks */}
      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
        <path d="M12 12 h14 M12 12 v14" />
        <path d="M308 12 h-14 M308 12 v14" />
        <path d="M12 308 h14 M12 308 v-14" />
        <path d="M308 308 h-14 M308 308 v-14" />
      </g>

      {/* Concentric orbits */}
      <g fill="none" stroke="currentColor" strokeWidth="0.75">
        <circle cx="160" cy="160" r="38" strokeOpacity="0.55" />
        <circle cx="160" cy="160" r="70" strokeOpacity="0.35" />
        <circle cx="160" cy="160" r="104" strokeOpacity="0.22" strokeDasharray="2 4" />
        <circle cx="160" cy="160" r="138" strokeOpacity="0.15" />
      </g>

      {/* Radial rays */}
      <g stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.5">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 24;
          const x1 = 160 + Math.cos(a) * 40;
          const y1 = 160 + Math.sin(a) * 40;
          const x2 = 160 + Math.cos(a) * 138;
          const y2 = 160 + Math.sin(a) * 138;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Orbiting nodes */}
      <g fill="currentColor">
        {[
          [70, -0.4],
          [104, 1.2],
          [104, -2.1],
          [138, 0.6],
          [138, 2.6],
          [70, 2.3],
        ].map(([r, a], i) => (
          <circle
            key={i}
            cx={160 + Math.cos(a) * r}
            cy={160 + Math.sin(a) * r}
            r={i % 2 ? 2.5 : 3.5}
          />
        ))}
      </g>

      {/* Core glow + nucleus */}
      <circle cx="160" cy="160" r="32" fill="url(#ai-core)" />
      <circle cx="160" cy="160" r="6" fill="currentColor" />
      <circle
        cx="160"
        cy="160"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />

      {/* Meta labels */}
      <g
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill="currentColor"
        fillOpacity="0.55"
        letterSpacing="1.5"
      >
        <text x="12" y="304">
          FIG.01 — CORTEX
        </text>
        <text x="308" y="304" textAnchor="end">
          λ / 0.284
        </text>
      </g>
    </svg>
  );
}

export function AutomationFlowArt({ className = "" }: ArtProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Abstract diagram of a business process flow"
    >
      <defs>
        <pattern id="flow-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="currentColor" fillOpacity="0.14" />
        </pattern>
        <marker
          id="flow-arrow"
          viewBox="0 0 8 8"
          refX="6"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
        </marker>
      </defs>

      <rect width="320" height="320" fill="url(#flow-dots)" />

      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
        <path d="M12 12 h14 M12 12 v14" />
        <path d="M308 12 h-14 M308 12 v14" />
        <path d="M12 308 h14 M12 308 v-14" />
        <path d="M308 308 h-14 M308 308 v-14" />
      </g>

      {/* Flow paths */}
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path
          d="M60 90 H140 Q160 90 160 110 V150"
          strokeOpacity="0.7"
          markerEnd="url(#flow-arrow)"
        />
        <path d="M260 90 H180 Q160 90 160 110 V150" strokeOpacity="0.7" />
        <path d="M60 230 H140 Q160 230 160 210 V180" strokeOpacity="0.7" />
        <path
          d="M260 230 H180 Q160 230 160 210 V180"
          strokeOpacity="0.7"
          markerEnd="url(#flow-arrow)"
        />
      </g>

      {/* Secondary faint traces */}
      <g
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="0.6"
        strokeDasharray="2 3"
      >
        <path d="M60 90 C 100 160, 100 160, 60 230" />
        <path d="M260 90 C 220 160, 220 160, 260 230" />
      </g>

      {/* Peripheral nodes */}
      <g>
        {[
          { x: 60, y: 90, label: "CRM" },
          { x: 260, y: 90, label: "ERP" },
          { x: 60, y: 230, label: "OPS" },
          { x: 260, y: 230, label: "BI" },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x - 22}
              y={n.y - 14}
              width="44"
              height="28"
              rx="3"
              fill="var(--color-card)"
              stroke="currentColor"
              strokeOpacity="0.55"
            />
            <text
              x={n.x}
              y={n.y + 3}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              fill="currentColor"
              fillOpacity="0.85"
              letterSpacing="1"
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>

      {/* Center orchestrator */}
      <g>
        <rect x="130" y="150" width="60" height="30" rx="3" fill="var(--color-foreground)" />
        <text
          x="160"
          y="169"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="var(--color-background)"
          letterSpacing="1.5"
        >
          ORCHESTR.
        </text>
        {/* accent tick */}
        <rect x="130" y="146" width="60" height="2" fill="var(--color-accent)" />
      </g>

      {/* Trace pulses */}
      <g fill="currentColor">
        <circle cx="110" cy="90" r="2" />
        <circle cx="210" cy="90" r="2" />
        <circle cx="110" cy="230" r="2" />
        <circle cx="210" cy="230" r="2" />
      </g>

      <g
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill="currentColor"
        fillOpacity="0.55"
        letterSpacing="1.5"
      >
        <text x="12" y="304">
          FIG.02 — FLOW
        </text>
        <text x="308" y="304" textAnchor="end">
          Σ / 04 nodes
        </text>
      </g>
    </svg>
  );
}

export function EfficiencyArt({ className = "" }: ArtProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Abstract diagram of operational efficiency metrics"
    >
      <defs>
        <linearGradient id="eff-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Baseline grid lines */}
      <g stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" x2="320" y1={40 + i * 30} y2={40 + i * 30} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={20 + i * 28} x2={20 + i * 28} y1="20" y2="300" />
        ))}
      </g>

      <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
        <path d="M12 12 h14 M12 12 v14" />
        <path d="M308 12 h-14 M308 12 v14" />
        <path d="M12 308 h14 M12 308 v-14" />
        <path d="M308 308 h-14 M308 308 v-14" />
      </g>

      {/* Distant range (soft) */}
      <path
        d="M0 220 L30 200 L60 210 L100 180 L140 195 L180 165 L220 175 L260 150 L300 160 L320 145 L320 320 L0 320 Z"
        fill="url(#eff-fill)"
      />
      <path
        d="M0 220 L30 200 L60 210 L100 180 L140 195 L180 165 L220 175 L260 150 L300 160 L320 145"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />

      {/* Mid range */}
      <path
        d="M0 250 L40 240 L80 245 L120 220 L160 225 L200 200 L240 205 L280 180 L320 190"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Primary sparkline (rising) */}
      <path
        d="M0 280 L20 275 L40 270 L60 265 L80 258 L100 250 L120 240 L140 232 L160 220 L180 205 L200 195 L220 178 L240 165 L260 150 L280 132 L300 118 L320 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* Milestones */}
      {[
        [80, 258],
        [160, 220],
        [240, 165],
        [320, 100],
      ].map(([x, y], i) => (
        <g key={i}>
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={302}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="1 3"
          />
          <circle cx={x} cy={y} r="3.5" fill="var(--color-background)" stroke="currentColor" />
        </g>
      ))}

      {/* Accent highlight on final point */}
      <circle cx="320" cy="100" r="5" fill="var(--color-accent)" />
      <circle
        cx="320"
        cy="100"
        r="10"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.35"
      />

      {/* Y-axis ticks */}
      <g
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill="currentColor"
        fillOpacity="0.5"
        letterSpacing="1"
      >
        <text x="18" y="46">
          100
        </text>
        <text x="18" y="136">
          ·75
        </text>
        <text x="18" y="226">
          ·50
        </text>
        <text x="18" y="296">
          ·25
        </text>
      </g>

      <g
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        fill="currentColor"
        fillOpacity="0.55"
        letterSpacing="1.5"
      >
        <text x="12" y="304">
          FIG.03 — SIGNAL
        </text>
        <text x="308" y="304" textAnchor="end">
          Δ / +38%
        </text>
      </g>
    </svg>
  );
}
