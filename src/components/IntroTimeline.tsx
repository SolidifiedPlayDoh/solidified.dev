import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

type IntroTimelineProps = {
  active: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
};

export function IntroTimeline({
  active,
  reducedMotion,
  onComplete,
}: IntroTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLSpanElement>(null);
  const suffixRef = useRef<HTMLSpanElement>(null);
  const playClusterRef = useRef<HTMLSpanElement>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useLayoutEffect(() => {
    if (!active || !rootRef.current) return;
    const done = () => completeRef.current();

    const root = rootRef.current;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll(".play-char"), { visibility: "hidden" });
      gsap.set(playClusterRef.current, { display: "none" });
      gsap.set(root, { visibility: "visible", opacity: 1 });
      gsap.set(stageRef.current, { visibility: "visible", opacity: 1 });
      gsap.set([solidRef.current, suffixRef.current], {
        visibility: "visible",
        opacity: 1,
      });
      gsap.set(suffixRef.current, {
        display: "inline-flex",
        autoAlpha: 1,
        x: 0,
        overflow: "",
        maxWidth: "",
      });
      const tlRm = gsap.timeline({ onComplete: done });
      tlRm.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.26 });
      tlRm.to(root, { opacity: 0, duration: 0.35 }, "+=0.45");
      return () => {
        tlRm.kill();
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: done,
      });
      gsap.set(root, { visibility: "visible", opacity: 1 });

      const brand = gsap.utils.selector(stageRef);

      const convergeShift = Math.min(window.innerWidth * 0.24, 220);

      tl.fromTo(
        stageRef.current,
        { autoAlpha: 0, scale: 0.985 },
        { autoAlpha: 1, scale: 1, duration: 0.95 },
      );

      tl.addLabel("fuse", ">0.2");

      tl.to(
        brand(".play-char"),
        {
          opacity: () => gsap.utils.random(0.12, 1),
          duration: () => gsap.utils.random(0.04, 0.14),
          stagger: {
            each: 0.05,
            repeat: 8,
            yoyo: true,
          },
        },
        "fuse",
      );

      tl.to(
        brand(".spark"),
        {
          opacity: 1,
          scale: (_, i) => 1 + (i % 3) * 0.35,
          duration: 0.08,
          stagger: { each: 0.02 },
        },
        "fuse+=0.35",
      );
      tl.to(brand(".spark"), { opacity: 0, duration: 0.12 }, ">");

      tl.to(
        brand(".play-char"),
        {
          opacity: 0,
          scale: 0.3,
          y: () => gsap.utils.random(-7, 7),
          filter: "brightness(2.35) blur(1px)",
          duration: () => gsap.utils.random(0.2, 0.36),
          stagger: {
            amount: 0.45,
            from: "random",
          },
        },
        "-=0.14",
      );
      tl.set(brand(".play-char"), { visibility: "hidden" });
      tl.set(playClusterRef.current, { display: "none" });
      tl.set(suffixRef.current, {
        display: "inline-flex",
        overflow: "hidden",
        maxWidth: 0,
        transformOrigin: "left center",
      });
      tl.set(solidRef.current, {
        transformOrigin: "right center",
      });

      tl.addLabel("meet", ">");

      tl.fromTo(
        solidRef.current,
        { x: -convergeShift, force3D: true },
        {
          x: 0,
          duration: 0.95,
          ease: "power3.inOut",
          force3D: true,
        },
        "meet",
      );
      tl.fromTo(
        suffixRef.current,
        {
          autoAlpha: 0,
          maxWidth: 0,
          x: convergeShift,
          force3D: true,
        },
        {
          autoAlpha: 1,
          maxWidth: Math.min(convergeShift + 420, window.innerWidth * 0.5),
          x: 0,
          duration: 0.95,
          ease: "power3.inOut",
          force3D: true,
          onComplete: () => {
            gsap.set(suffixRef.current, {
              clearProps: "transformOrigin,maxWidth,overflow",
            });
            gsap.set(solidRef.current, { clearProps: "transformOrigin" });
          },
        },
        "meet",
      );
      tl.fromTo(
        stageRef.current,
        { filter: "brightness(1)" },
        {
          filter: "brightness(1.28)",
          duration: 0.05,
        },
        "meet+=0.78",
      );
      tl.fromTo(
        stageRef.current,
        { filter: "brightness(1.28)" },
        { filter: "brightness(1)", duration: 0.08 },
        ">",
      );

      tl.to(
        stageRef.current,
        { autoAlpha: 0, duration: 0.9, ease: "power3.inOut" },
        "+=1.15",
      );
      tl.to(
        root,
        { autoAlpha: 0, duration: 0.7, ease: "power3.inOut" },
        "-=0.38",
      );

      tl.timeScale(1.04);
    }, rootRef);

    return () => ctx.revert();
  }, [active, reducedMotion]);

  if (!active) return null;

  const play = "playdoh".split("");

  const sparkDots = [
    { left: "12%", top: "18%", rot: "-18deg", w: "1.05rem", h: "3px", id: "s0" },
    { left: "78%", top: "26%", rot: "32deg", w: "0.95rem", h: "4px", id: "s1" },
    { left: "22%", top: "62%", rot: "-40deg", w: "1.2rem", h: "4px", id: "s2" },
    { left: "86%", top: "58%", rot: "12deg", w: "0.8rem", h: "3px", id: "s3" },
    { left: "52%", top: "12%", rot: "-6deg", w: "1.4rem", h: "2px", id: "s4" },
  ] as const;

  return (
    <div ref={rootRef} className="intro-inner crt-bloom" style={{ visibility: "hidden" }}>
      <div ref={stageRef} style={{ visibility: "hidden" }}>
        <p
          className="crt-bloom intro-brand-stack"
          style={{
            fontSize: "clamp(1.85rem, 7vw, 5rem)",
            margin: "0 auto 1rem",
            lineHeight: 1.05,
            position: "relative",
            textAlign: "center",
          }}
          aria-hidden
        >
          <span className="intro-brand-merge"><span ref={solidRef} className="neon-hero brand-solid meet-solid">solidified</span><span aria-hidden ref={playClusterRef} className="play-cluster">{play.map((ch, idx) => (
                <span key={`${ch}-${idx}`} className="play-char neon-hero">{ch}</span>
              ))}</span><span
              ref={suffixRef}
              className="neon-hero--magenta meet-dev-wrap"
              style={{
                display: "none",
                marginInlineStart: "-0.02em",
                overflow: "hidden",
                maxWidth: 0,
              }}
            >
              <span className="suffix-char">.</span>
              {"dev".split("").map((ch, idx) => (
                <span key={`${ch}-${idx}-suf`} className="suffix-char">
                  {ch}
                </span>
              ))}
            </span></span>
          {sparkDots.map((s) => (
            <span
              key={s.id}
              className="spark neon-hero--magenta"
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.w,
                height: s.h,
                transform: `rotate(${s.rot})`,
                opacity: 0,
                pointerEvents: "none",
                borderRadius: 99,
                boxShadow: "0 0 12px #ff4df0",
              }}
            />
          ))}
        </p>
      </div>

      <style>
        {`
          .intro-brand-merge {
            display: inline-block;
            vertical-align: top;
          }
          .brand-solid.meet-solid { display: inline; text-transform: none; }
          .meet-dev-wrap { align-items: baseline; gap: 0; }
          .intro-brand-merge .play-cluster {
            margin: 0;
            padding: 0;
            display: inline;
            white-space: nowrap;
          }
          .intro-brand-merge .play-char {
            display: inline;
            letter-spacing: inherit;
            margin: 0;
            padding: 0;
          }
          `}
      </style>
    </div>
  );
}
