import { useEffect, useRef, useState } from "react";

import { getIntel, type IntelDossier } from "../content/intelContent";
import { usePsychoBoot } from "../context/PsychoBootContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const PANEL_W = 260;
const PANEL_H = 148;
const CARD_W = 158;
const CARD_H = 42;
const CARD_GAP = 8;
const PAD = 12;
/** Dwell time before intel pops — same host only. */
const SHOW_DELAY_MS = 3000;

type IntelState = {
  dossier: IntelDossier;
  mx: number;
  my: number;
};

type Layout = {
  side: "right" | "left";
  vertical: "up" | "down";
  panelX: number;
  panelY: number;
  cards: { x: number; y: number }[];
  lead: string;
  branches: string[];
};

function layoutIntel(mx: number, my: number, branchCount: number): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceRight = vw - mx;
  const spaceLeft = mx;
  const spaceAbove = my;
  const spaceBelow = vh - my;

  // Prefer up + right; flip when the cluster won't fit
  const clusterW = PANEL_W + 20 + CARD_W;
  const clusterH = PANEL_H + 24 + branchCount * (CARD_H + CARD_GAP);

  const side: "right" | "left" =
    spaceRight >= clusterW + PAD || spaceRight >= spaceLeft ? "right" : "left";
  const vertical: "up" | "down" =
    spaceAbove >= Math.min(clusterH, PANEL_H + 80) || spaceAbove >= spaceBelow
      ? "up"
      : "down";

  let panelX =
    side === "right" ? mx + 28 : mx - 28 - PANEL_W;
  panelX = Math.max(PAD, Math.min(panelX, vw - PANEL_W - PAD));

  let panelY =
    vertical === "up" ? my - 20 - PANEL_H : my + 24;
  panelY = Math.max(PAD, Math.min(panelY, vh - PANEL_H - PAD));

  // Branch cards fan outward + further up/down from the panel
  const cards: { x: number; y: number }[] = [];
  const branchPaths: string[] = [];

  const stemX = side === "right" ? panelX + PANEL_W - 10 : panelX + 10;
  const stemBaseY = vertical === "up" ? panelY + 18 : panelY + PANEL_H - 18;

  for (let i = 0; i < branchCount; i++) {
    const cardX =
      side === "right"
        ? Math.min(panelX + PANEL_W + 18, vw - CARD_W - PAD)
        : Math.max(PAD, panelX - 18 - CARD_W);

    const stackOffset = (i + 1) * (CARD_H + CARD_GAP);
    let cardY =
      vertical === "up"
        ? panelY - 8 - stackOffset
        : panelY + PANEL_H + 8 + i * (CARD_H + CARD_GAP);

    cardY = Math.max(PAD, Math.min(cardY, vh - CARD_H - PAD));
    cards.push({ x: cardX, y: cardY });

    const joinY = cardY + CARD_H / 2;
    const joinX = side === "right" ? cardX : cardX + CARD_W;
    // Elbow: up/down the stem, then out to the card
    branchPaths.push(
      `M ${stemX} ${stemBaseY} L ${stemX} ${joinY} L ${joinX} ${joinY}`,
    );
  }

  const leadElbowX = side === "right" ? mx + 14 : mx - 14;
  const leadEndX = side === "right" ? panelX : panelX + PANEL_W;
  const leadEndY = panelY + (vertical === "up" ? PANEL_H - 24 : 28);
  const lead = `M ${mx} ${my} L ${leadElbowX} ${my} L ${leadElbowX} ${leadEndY} L ${leadEndX} ${leadEndY}`;

  return {
    side,
    vertical,
    panelX,
    panelY,
    cards,
    lead,
    branches: branchPaths,
  };
}

export function IntelLayer() {
  const { bootComplete, booting } = usePsychoBoot();
  const reducedMotion = usePrefersReducedMotion();
  const [intel, setIntel] = useState<IntelState | null>(null);
  const hideTimer = useRef(0);
  const showTimer = useRef(0);
  const hostRef = useRef<Element | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const active = bootComplete && !booting && !reducedMotion;

  useEffect(() => {
    if (!active) {
      setIntel(null);
      hostRef.current = null;
      window.clearTimeout(showTimer.current);
      return;
    }

    const cancelShow = () => {
      window.clearTimeout(showTimer.current);
      showTimer.current = 0;
    };

    const armShow = (el: Element) => {
      const id = el.getAttribute("data-intel");
      const dossier = getIntel(id);
      if (!dossier) return;

      // Same host — keep the dwell timer running
      if (hostRef.current === el) {
        window.clearTimeout(hideTimer.current);
        return;
      }

      cancelShow();
      window.clearTimeout(hideTimer.current);
      hostRef.current = el;
      setIntel(null);

      showTimer.current = window.setTimeout(() => {
        if (hostRef.current !== el) return;
        setIntel({
          dossier,
          mx: pointerRef.current.x,
          my: pointerRef.current.y,
        });
        showTimer.current = 0;
      }, SHOW_DELAY_MS);
    };

    const onOver = (event: Event) => {
      const e = event as MouseEvent;
      pointerRef.current = { x: e.clientX, y: e.clientY };
      const t = e.target;
      if (!(t instanceof Element)) return;
      const host = t.closest("[data-intel]");
      if (host) {
        armShow(host);
        return;
      }
      if (t.closest(".intel-layer")) {
        window.clearTimeout(hideTimer.current);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };

    const onOut = (event: Event) => {
      const e = event as MouseEvent;
      const related = e.relatedTarget;
      if (related instanceof Element) {
        const nextHost = related.closest("[data-intel]");
        if (nextHost && nextHost === hostRef.current) return;
        if (related.closest(".intel-layer")) return;
      }
      hideTimer.current = window.setTimeout(() => {
        cancelShow();
        hostRef.current = null;
        setIntel(null);
      }, 100);
    };

    const clear = () => {
      cancelShow();
      hostRef.current = null;
      setIntel(null);
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("scroll", clear, { passive: true });
    window.addEventListener("resize", clear);

    return () => {
      window.clearTimeout(hideTimer.current);
      cancelShow();
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", clear);
      window.removeEventListener("resize", clear);
    };
  }, [active]);

  if (!intel) return null;

  const { dossier, mx, my } = intel;
  const layout = layoutIntel(mx, my, dossier.branches.length);

  return (
    <div
      className={`intel-layer intel-layer--${layout.side} intel-layer--${layout.vertical}`}
      aria-hidden="true"
    >
      <svg className="intel-layer__wires" width="100%" height="100%">
        <circle className="intel-layer__dot" cx={mx} cy={my} r="3" />
        <path className="intel-layer__lead" d={layout.lead} />
        {layout.branches.map((d, i) => (
          <path
            key={i}
            className={`intel-layer__branch intel-layer__branch--${i}`}
            d={d}
          />
        ))}
      </svg>

      <div
        className="intel-layer__panel"
        style={{ left: layout.panelX, top: layout.panelY }}
      >
        <div className="intel-layer__stamp">{dossier.tag}</div>
        <div className="intel-layer__meta">
          <span>{dossier.id}</span>
          <span>INFO</span>
        </div>
        <p className="intel-layer__subject">{dossier.subject}</p>
        <p className="intel-layer__summary">{dossier.summary}</p>
      </div>

      {dossier.branches.map((branch, i) => (
        <div
          key={branch.label}
          className={`intel-layer__card intel-layer__card--${i}`}
          style={{ left: layout.cards[i].x, top: layout.cards[i].y }}
        >
          <span className="intel-layer__card-label">{branch.label}</span>
          <span className="intel-layer__card-value">{branch.value}</span>
        </div>
      ))}
    </div>
  );
}
