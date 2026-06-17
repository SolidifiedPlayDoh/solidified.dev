import { useEffect, useRef, type CSSProperties } from "react";

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type WireShape = {
  id: string;
  kind: "cube" | "sphere";
  left: string;
  top: string;
  size: number;
  driftX: number;
  driftY: number;
  spin: number;
  spin2: number;
  duration: number;
  delay: number;
  opacity: number;
};

const SHAPES: WireShape[] = [
  { id: "a", kind: "cube", left: "6%", top: "14%", size: 58, driftX: 28, driftY: -22, spin: 34, spin2: 21, duration: 38, delay: 0, opacity: 0.82 },
  { id: "b", kind: "sphere", left: "78%", top: "8%", size: 72, driftX: -18, driftY: 30, spin: 26, spin2: 0, duration: 44, delay: 2, opacity: 0.78 },
  { id: "c", kind: "cube", left: "88%", top: "42%", size: 44, driftX: -32, driftY: 18, spin: 19, spin2: 27, duration: 31, delay: 5, opacity: 0.7 },
  { id: "d", kind: "sphere", left: "12%", top: "58%", size: 52, driftX: 22, driftY: -26, spin: 41, spin2: 0, duration: 52, delay: 1, opacity: 0.8 },
  { id: "e", kind: "cube", left: "42%", top: "72%", size: 50, driftX: -14, driftY: -20, spin: 23, spin2: 33, duration: 36, delay: 8, opacity: 0.68 },
  { id: "f", kind: "sphere", left: "62%", top: "28%", size: 84, driftX: 16, driftY: 24, spin: 31, spin2: 0, duration: 48, delay: 3, opacity: 0.65 },
  { id: "g", kind: "cube", left: "24%", top: "32%", size: 40, driftX: 20, driftY: 16, spin: 17, spin2: 29, duration: 29, delay: 11, opacity: 0.72 },
  { id: "h", kind: "sphere", left: "52%", top: "88%", size: 64, driftX: -24, driftY: -12, spin: 37, spin2: 0, duration: 41, delay: 6, opacity: 0.76 },
  { id: "i", kind: "cube", left: "72%", top: "68%", size: 46, driftX: 12, driftY: -28, spin: 28, spin2: 18, duration: 33, delay: 9, opacity: 0.66 },
  { id: "j", kind: "sphere", left: "34%", top: "6%", size: 56, driftX: -20, driftY: 14, spin: 22, spin2: 0, duration: 46, delay: 4, opacity: 0.74 },
  { id: "k", kind: "cube", left: "92%", top: "78%", size: 36, driftX: -16, driftY: 20, spin: 15, spin2: 24, duration: 27, delay: 13, opacity: 0.62 },
  { id: "l", kind: "sphere", left: "4%", top: "82%", size: 66, driftX: 26, driftY: -18, spin: 35, spin2: 0, duration: 55, delay: 7, opacity: 0.7 },
];

function WireCube({ size, spin, spin2 }: { size: number; spin: number; spin2: number }) {
  const half = `${size / 2}px`;
  return (
    <div
      className="wirefield__cube"
      style={{ width: size, height: size, "--cube-half": half } as CSSProperties}
    >
      <div
        className="wirefield__cube-frame"
        style={{ animationDuration: `${spin}s` }}
      >
        <span className="wirefield__cube-edge wirefield__cube-edge--front" />
        <span className="wirefield__cube-edge wirefield__cube-edge--back" />
        <span className="wirefield__cube-edge wirefield__cube-edge--left" />
        <span className="wirefield__cube-edge wirefield__cube-edge--right" />
        <span className="wirefield__cube-edge wirefield__cube-edge--top" />
        <span className="wirefield__cube-edge wirefield__cube-edge--bottom" />
      </div>
      <div
        className="wirefield__cube-frame wirefield__cube-frame--inner"
        style={{ animationDuration: `${spin2}s` }}
      />
    </div>
  );
}

/** Latitude rings (rotateX) + meridians (rotateY + rotateX 90°) = wireframe sphere. */
const SPHERE_LATITUDE = [-72, -48, -24, 0, 24, 48, 72] as const;
const SPHERE_LONGITUDE = [0, 30, 60, 90, 120, 150] as const;

function WireSphere({ size, spin }: { size: number; spin: number }) {
  return (
    <div
      className="wirefield__sphere-3d"
      style={{ width: size, height: size, animationDuration: `${spin}s` }}
    >
      {SPHERE_LATITUDE.map((lat) => (
        <span
          key={`lat-${lat}`}
          className="wirefield__sphere-ring"
          style={{ transform: `rotateX(${lat}deg)` }}
        />
      ))}
      {SPHERE_LONGITUDE.map((lon) => (
        <span
          key={`lon-${lon}`}
          className="wirefield__sphere-ring wirefield__sphere-ring--meridian"
          style={{ transform: `rotateY(${lon}deg) rotateX(90deg)` }}
        />
      ))}
    </div>
  );
}

export function WireframeField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    let raf = 0;

    const updateCamera = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = scrollY / maxScroll;

      root.style.setProperty("--camera-y", `${scrollY.toFixed(2)}px`);
      root.style.setProperty("--camera-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateCamera);
    };

    updateCamera();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div ref={rootRef} className="wirefield" aria-hidden="true">
      <div className="wirefield__camera">
        <div className="wirefield__world">
          {SHAPES.map((shape) => (
            <div
              key={shape.id}
              className="wirefield__drifter"
              style={
                {
                  left: shape.left,
                  top: shape.top,
                  "--drift-x": `${shape.driftX}px`,
                  "--drift-y": `${shape.driftY}px`,
                  "--drift-dur": `${shape.duration}s`,
                  "--drift-delay": `${shape.delay}s`,
                  opacity: shape.opacity,
                } as CSSProperties
              }
            >
              {shape.kind === "cube" ? (
                <WireCube size={shape.size} spin={shape.spin} spin2={shape.spin2} />
              ) : (
                <WireSphere size={shape.size} spin={shape.spin} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
