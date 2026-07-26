import { useEffect } from "react";

import { siteContent } from "../content/siteDefaults";

type PsychoBootOverlayProps = {
  onHandoff: () => void;
  onFinished: () => void;
};

/** Chaos phase — then hard handoff into UI. */
export const BOOT_MS = 1450;
/** Main UI starts slamming into place under the overlay. */
export const HANDOFF_MS = 1000;

export function PsychoBootOverlay({ onHandoff, onFinished }: PsychoBootOverlayProps) {
  useEffect(() => {
    const handoff = window.setTimeout(onHandoff, HANDOFF_MS);
    const done = window.setTimeout(onFinished, BOOT_MS);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onHandoff();
        onFinished();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(handoff);
      window.clearTimeout(done);
      window.removeEventListener("keydown", onKey);
    };
  }, [onHandoff, onFinished]);

  return (
    <div
      className="psycho-boot"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading interface"
      onClick={() => {
        onHandoff();
        onFinished();
      }}
    >
      <div className="psycho-boot__void" aria-hidden />
      <div className="psycho-boot__noise" aria-hidden />
      <div className="psycho-boot__scan" aria-hidden />
      <div className="psycho-boot__grid" aria-hidden />
      <div className="psycho-boot__cells" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className={`psycho-boot__cell psycho-boot__cell--${i}`} />
        ))}
      </div>

      <div className="psycho-boot__slits" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`psycho-boot__slit psycho-boot__slit--${i}`} />
        ))}
      </div>

      <div className="psycho-boot__tears" aria-hidden>
        <span className="psycho-boot__tear psycho-boot__tear--a" />
        <span className="psycho-boot__tear psycho-boot__tear--b" />
        <span className="psycho-boot__tear psycho-boot__tear--c" />
        <span className="psycho-boot__tear psycho-boot__tear--d" />
        <span className="psycho-boot__tear psycho-boot__tear--e" />
      </div>

      <div className="psycho-boot__shards" aria-hidden>
        <span className="psycho-boot__pill">DELETE</span>
        <span className="psycho-boot__pill psycho-boot__pill--b">DELETE</span>
        <span className="psycho-boot__pill psycho-boot__pill--c">OK</span>
        <span className="psycho-boot__tag">EXC#3</span>
        <span className="psycho-boot__tag psycho-boot__tag--b">fx · ON</span>
        <span className="psycho-boot__tag psycho-boot__tag--c">wiggle(1,10)</span>
        <span className="psycho-boot__tag psycho-boot__tag--d">posterizeTime</span>
      </div>

      <svg className="psycho-boot__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <circle className="psycho-boot__ring" cx="72" cy="38" r="8" />
        <circle className="psycho-boot__ring psycho-boot__ring--b" cx="72" cy="38" r="14" />
        <circle className="psycho-boot__ring psycho-boot__ring--c" cx="72" cy="38" r="22" />
        <path className="psycho-boot__arc" d="M88 12 C98 30 98 58 82 82" />
        <path className="psycho-boot__slab" d="M8 68 L28 58 L34 68 L14 78 Z" />
        <path className="psycho-boot__slab psycho-boot__slab--b" d="M62 78 L88 70 L92 78 L66 86 Z" />
      </svg>

      <div className="psycho-boot__brand" aria-hidden>
        <span className="psycho-boot__brand-layer psycho-boot__brand-layer--ghost">
          {siteContent.headline}
        </span>
        <span className="psycho-boot__brand-layer psycho-boot__brand-layer--base">
          {siteContent.headline}
        </span>
        <span className="psycho-boot__brand-layer psycho-boot__brand-layer--cyan">
          {siteContent.headline}
        </span>
        <span className="psycho-boot__brand-layer psycho-boot__brand-layer--mag">
          {siteContent.headline}
        </span>
      </div>

      <p className="psycho-boot__status">CORRUPT → SOLID</p>
      <p className="psycho-boot__skip">click / Esc skip</p>
    </div>
  );
}
