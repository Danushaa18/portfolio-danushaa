"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { isLowPowerDevice, useReducedMotion } from "@/lib/device";

export type FlashlightProps = {
  /** Always-visible layer. Must be fully readable on its own. */
  base: ReactNode;
  /** Layer revealed under the beam. Rendered on top, masked, aria-hidden. */
  reveal: ReactNode;
  /** Beam radius in px for mouse / pen. */
  radius?: number;
  /** Beam radius in px for touch. */
  touchRadius?: number;
  /** Fraction of the radius that stays at full brightness (0–1). */
  core?: number;
  /** Colour of the ambient glow around the beam. */
  glow?: string;
  /** Follow smoothing per frame (0–1). 1 = no smoothing. */
  ease?: number;
  /** Where the beam rests before any input, as fractions of the box. */
  rest?: { x: number; y: number };
  /** Accessible names for the "reveal everything" toggle. */
  showLabel?: string;
  hideLabel?: string;
  className?: string;
  /** Extra hint text shown next to the toggle. */
  hint?: string;
};

/**
 * An inspection lamp. The `reveal` layer sits exactly over `base` and is
 * masked by a radial gradient centred on the pointer. Position is written
 * straight to CSS custom properties from a requestAnimationFrame loop that
 * only runs while the beam is still moving — React never re-renders on move.
 */
export function Flashlight({
  base,
  reveal,
  radius = 240,
  touchRadius = 150,
  core = 0.32,
  glow = "rgba(255, 228, 170, 0.11)",
  ease = 0.18,
  rest = { x: 0.62, y: 0.42 },
  showLabel = "Show everything under the lamp",
  hideLabel = "Back to the lamp",
  hint,
  className,
}: FlashlightProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealAll, setRevealAll] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const lowPower = isLowPowerDevice();
    const smoothing = reduced || lowPower ? 1 : ease;
    el.dataset.lowPower = lowPower ? "true" : "false";

    let raf = 0;
    let clientX = -1;
    let clientY = -1;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let r = window.matchMedia("(pointer: coarse)").matches ? touchRadius : radius;
    let initialised = false;

    const write = () => {
      el.style.setProperty("--fx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--fy", `${cy.toFixed(1)}px`);
      el.style.setProperty("--fr", `${r}px`);
    };

    const placeAtRest = () => {
      const rect = el.getBoundingClientRect();
      tx = cx = rect.width * rest.x;
      ty = cy = rect.height * rest.y;
      initialised = true;
      write();
    };

    const tick = () => {
      raf = 0;
      if (clientX >= 0) {
        // One layout read per frame, never per pointer event.
        const rect = el.getBoundingClientRect();
        tx = clientX - rect.left;
        ty = clientY - rect.top;
      }
      cx += (tx - cx) * smoothing;
      cy += (ty - cy) * smoothing;
      write();
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) raf = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && e.buttons === 0) return;
      r = e.pointerType === "touch" ? touchRadius : radius;
      clientX = e.clientX;
      clientY = e.clientY;
      el.dataset.active = "true";
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      // Tap places the lamp; a horizontal drag moves it (vertical pans scroll).
      r = touchRadius;
      clientX = e.clientX;
      clientY = e.clientY;
      el.dataset.active = "true";
      schedule();
    };

    // Keep the beam glued to the same spot of content while the page scrolls.
    const onScroll = () => {
      if (clientX >= 0) schedule();
    };

    const onResize = () => {
      if (clientX < 0) placeAtRest();
    };

    if (!initialised) placeAtRest();
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [radius, touchRadius, ease, rest.x, rest.y, reduced]);

  const style = {
    "--fr": `${radius}px`,
    "--fcore": core,
    "--fglow": glow,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={["lamp", className].filter(Boolean).join(" ")}
      data-reveal-all={revealAll ? "true" : "false"}
      style={style}
    >
      <div className="lamp__base">{base}</div>
      <div className="lamp__reveal" aria-hidden="true">
        {reveal}
      </div>
      <div className="lamp__glow" aria-hidden="true" />
      <div className="lamp__controls">
        <button
          type="button"
          className="lamp__toggle"
          aria-pressed={revealAll}
          onClick={() => setRevealAll((v) => !v)}
        >
          <span className="lamp__toggle-dot" aria-hidden="true" />
          {revealAll ? hideLabel : showLabel}
        </button>
        {hint ? <span className="lamp__hint">{hint}</span> : null}
      </div>
    </div>
  );
}
