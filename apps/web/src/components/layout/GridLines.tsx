"use client";

const verticalPositions = ["12.6%", "37.5%", "61.9%", "86.2%"];
const horizontalPositions = ["32.7%", "71.4%"];

export function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Vertical lines */}
      {verticalPositions.map((left, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full w-px bg-white/[0.04] anim-grid-v hidden md:block"
          style={{ left, animationDelay: `${600 + i * 100}ms` }}
        />
      ))}

      {/* Horizontal lines */}
      {horizontalPositions.map((top, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 w-full h-px bg-white/[0.04] anim-grid-h hidden md:block"
          style={{ top, animationDelay: `${800 + i * 150}ms` }}
        />
      ))}

      {/* Plus marks at intersections */}
      {horizontalPositions.map((top, hi) =>
        verticalPositions.map((left, vi) => (
          <div
            key={`plus-${hi}-${vi}`}
            className="absolute anim-scale-in hidden md:block"
            style={{ top, left, animationDelay: `${1000 + (hi * 4 + vi) * 80}ms` }}
          >
            <div className="absolute w-[10px] h-px bg-white/70 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-px h-[10px] bg-white/70 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))
      )}
    </div>
  );
}
