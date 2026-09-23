"use client";

const nodes = [
  {
    square: { top: "27%", left: "60%" },
    squareDelay: 1500,
    label: { top: "11%", left: "26%" },
    labelAnim: "anim-slide-left",
    labelDelay: 1100,
    title: "[ PROPERTY ]",
    description: "Your dream home, verified and secured.",
    descriptionMaxW: "max-w-[160px]",
  },
  {
    square: { top: "58%", left: "32%" },
    squareDelay: 1800,
    label: { top: "76%", left: "3%" },
    labelAnim: "anim-slide-left",
    labelDelay: 1400,
    title: "[ FINANCING ]",
    description: "Transparent terms, no hidden fees.",
    descriptionMaxW: "max-w-[160px]",
  },
  {
    square: { top: "63%", left: "50%" },
    squareDelay: 2100,
    label: { top: "50%", left: "78%" },
    labelAnim: "anim-slide-right",
    labelDelay: 1700,
    title: "[ MONTHLY ]",
    description: "Pay from your salary, stress-free.",
    descriptionMaxW: "max-w-[180px]",
  },
];

const connectors = [
  { x1: "38%", y1: "14%", x2: "52%", y2: "14%", delay: 1200 },
  { x1: "52%", y1: "14%", x2: "60%", y2: "27%", delay: 1400 },
  { x1: "32%", y1: "58%", x2: "20%", y2: "74%", delay: 1500 },
  { x1: "20%", y1: "74%", x2: "6%", y2: "74%", delay: 1700 },
  { x1: "78%", y1: "53%", x2: "63%", y2: "53%", delay: 1800 },
  { x1: "63%", y1: "53%", x2: "50%", y2: "63%", delay: 2000 },
];

function ConnectorLine({ x1, y1, x2, y2, delay }: {
  x1: string; y1: string; x2: string; y2: string; delay: number;
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none anim-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="rgba(175, 221, 255, 0.12)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function CentralNodes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
      {/* Connector lines */}
      {connectors.map((c, i) => (
        <ConnectorLine key={`conn-${i}`} {...c} />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div key={`node-${i}`}>
          <div
            className="absolute w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-white/20 anim-scale-in"
            style={{
              top: node.square.top,
              left: node.square.left,
              animationDelay: `${node.squareDelay}ms`,
            }}
          />
          <div
            className={`absolute ${node.labelAnim}`}
            style={{
              top: node.label.top,
              left: node.label.left,
              animationDelay: `${node.labelDelay}ms`,
            }}
          >
            <span className="font-mono text-white text-[13px] leading-[15.6px] whitespace-nowrap">
              {node.title}
            </span>
            <p className={`font-mono text-white/40 text-[11px] leading-[14px] mt-1 ${node.descriptionMaxW}`}>
              {node.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
