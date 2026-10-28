"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Hand, HAND_SIZE, HAND_TIP } from "./Hand";
import { ContactOverlay } from "./ContactOverlay";

/** Where each string ties onto the button, as fractions of its box. */
const ANCHORS = [
  { u: 0.03, v: 0.38, w: 1.1, j: [-6, 4, 5, -3] },
  { u: 0.06, v: 0.82, w: 0.8, j: [4, -5, -3, 6] },
  { u: 0.16, v: 1.0, w: 1.3, j: [-3, 7, 6, 2] },
  { u: 0.3, v: 1.0, w: 0.9, j: [7, 2, -6, 5] },
  { u: 0.46, v: 1.0, w: 1.0, j: [-5, -4, 4, 8] },
];

const SHADOW_REST =
  "0px 16px 26px -14px rgba(0,0,0,0.55), 0px 2px 4px 0px rgba(0,0,0,0.22), inset 0px 1px 0px 0px rgba(255,255,255,0.22), inset 0px -10px 18px 0px rgba(0,0,0,0.55)";
const SHADOW_LIFT =
  "0px 34px 44px -20px rgba(0,0,0,0.5), 0px 8px 12px 0px rgba(0,0,0,0.16), inset 0px 1px 0px 0px rgba(255,255,255,0.32), inset 0px -10px 18px 0px rgba(0,0,0,0.5)";

/**
 * Ownership of motion, so the two libraries never fight over one property:
 *  - GSAP: section entrance, string drawing and sway, hand pull, and the
 *    `.collab__rig` wrapper's x/y (the button being tugged).
 *  - Framer Motion: the button itself (tilt, lift, gloss sweep, tap) and the
 *    morph into the contact overlay.
 */
export function HireMe() {
  const scope = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const stringRefs = useRef<(SVGPathElement | null)[]>([]);
  const knotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const [open, setOpen] = useState(false);

  // Framer Motion tilt for the button.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 260, damping: 22 });

  const onButtonMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 18);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  useGSAP(
    () => {
      const stage = stageRef.current!;
      const rig = rigRef.current!;
      const hand = handRef.current!;
      const strings = stringRefs.current.filter(Boolean) as SVGPathElement[];
      const knots = knotRefs.current.filter(Boolean) as SVGCircleElement[];

      // Live values the ticker reads. GSAP tweens these plain objects.
      const state = { pull: 0, impulse: 0, t: 0, px: 0, py: 0, tpx: 0, tpy: 0 };
      const layout = { w: 0, h: 0, scale: 1, hx: 0, hy: 0 };
      const setRigX = gsap.quickSetter(rig, "x", "px");
      const setRigY = gsap.quickSetter(rig, "y", "px");

      const measure = () => {
        const r = stage.getBoundingClientRect();
        layout.w = r.width;
        layout.h = r.height;
        layout.scale = gsap.utils.clamp(0.48, 1.05, r.width / 1100);
        layout.hx = r.width * (r.width < 640 ? 0.0 : 0.06);
        layout.hy = r.height - HAND_SIZE.h * layout.scale + 6;
      };

      const render = () => {
        const { pull, impulse, t } = state;
        state.px += (state.tpx - state.px) * 0.08;
        state.py += (state.tpy - state.py) * 0.08;

        // The hand eases back when pulling; the button is tugged towards it.
        const back = pull * 14 * layout.scale;
        const hx = layout.hx - back;
        const hy = layout.hy + back * 0.55;
        const tilt = -pull * 4;
        hand.setAttribute(
          "transform",
          `translate(${hx.toFixed(2)} ${hy.toFixed(2)}) rotate(${tilt.toFixed(2)} ${HAND_TIP.x * layout.scale} ${HAND_TIP.y * layout.scale}) scale(${layout.scale})`,
        );
        setRigX(-pull * 8 * layout.scale);
        setRigY(pull * 5 * layout.scale);

        const stageBox = stage.getBoundingClientRect();
        const rigBox = rig.getBoundingClientRect();
        const ox = rigBox.left - stageBox.left;
        const oy = rigBox.top - stageBox.top;

        // Tip in stage coordinates (approximate the small rotation as none).
        const tipX = hx + HAND_TIP.x * layout.scale;
        const tipY = hy + HAND_TIP.y * layout.scale;

        strings.forEach((path, i) => {
          const a = ANCHORS[i];
          const bx = ox + rigBox.width * a.u;
          const by = oy + rigBox.height * a.v;
          const ax = tipX + (i - 2) * 1.2;
          const ay = tipY + (i - 2) * 0.9;
          const dx = bx - ax;
          const dy = by - ay;
          const len = Math.hypot(dx, dy);
          const slack = (1 - pull * 0.75) * len * 0.1;
          const sway = Math.sin(t * 0.85 + i * 1.7) * (2.2 + impulse * 16) + Math.sin(t * 2.1 + i) * impulse * 6;
          const pointerPull = 0.035 * (1 - pull * 0.5);
          const c1x = ax + dx * 0.32 + a.j[0] + state.px * pointerPull * 0.6;
          const c1y = ay + dy * 0.32 + slack + sway + a.j[1] + state.py * pointerPull * 0.6;
          const c2x = ax + dx * 0.7 + a.j[2] + state.px * pointerPull;
          const c2y = ay + dy * 0.7 + slack * 0.7 - sway * 0.6 + a.j[3] + state.py * pointerPull;
          path.setAttribute(
            "d",
            `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${bx.toFixed(1)} ${by.toFixed(1)}`,
          );
          const knot = knots[i];
          if (knot) {
            knot.setAttribute("cx", bx.toFixed(1));
            knot.setAttribute("cy", by.toFixed(1));
          }
        });
      };

      const tick = (_time: number, delta: number) => {
        state.t += delta / 1000;
        render();
      };

      const onPointer = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        state.tpx = e.clientX - r.left - r.width / 2;
        state.tpy = e.clientY - r.top - r.height / 2;
      };
      const onLeave = () => {
        state.tpx = 0;
        state.tpy = 0;
      };
      // Touch alternative: a tap twangs the strings.
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        gsap.fromTo(state, { impulse: 1 }, { impulse: 0, duration: 1.6, ease: "power2.out", overwrite: true });
      };

      measure();
      const ro = new ResizeObserver(() => {
        measure();
        render();
      });
      ro.observe(stage);

      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.set(strings, { attr: { pathLength: 1 }, strokeDasharray: 1, strokeDashoffset: 1 });
        render();

        const intro = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: "top 65%", once: true },
          defaults: { ease: "power3.out" },
        });
        intro
          .from(".collab__heading > span", { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out" })
          .from(".collab__sub", { autoAlpha: 0, y: 12, duration: 0.8 }, "-=0.7")
          .from(rig, { autoAlpha: 0, scale: 0.86, duration: 0.9, ease: "back.out(1.6)" }, "-=0.6")
          .from(hand, { autoAlpha: 0, duration: 0.6 }, "-=0.5")
          .to(strings, { strokeDashoffset: 0, duration: 1.3, stagger: 0.09, ease: "power2.inOut" }, "-=0.2")
          .from(knots, { autoAlpha: 0, duration: 0.3, stagger: 0.05 }, "-=0.6")
          .add(() => tug.play(), "-=0.2");

        const tug = gsap
          .timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
          .to(state, { pull: 1, duration: 0.45, ease: "power2.out" })
          .to(state, { pull: 0.2, duration: 0.5, ease: "sine.inOut" })
          .to(state, { pull: 0.85, duration: 0.35, ease: "power2.out" })
          .to(state, { pull: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });

        // Only tick while the section is on screen.
        const st = ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (self.isActive) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
            if (!self.isActive) tug.pause();
            else if (intro.progress() === 1) tug.play();
          },
        });

        stage.addEventListener("pointermove", onPointer, { passive: true });
        stage.addEventListener("pointerleave", onLeave);
        stage.addEventListener("pointerdown", onDown, { passive: true });

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          tug.kill();
          stage.removeEventListener("pointermove", onPointer);
          stage.removeEventListener("pointerleave", onLeave);
          stage.removeEventListener("pointerdown", onDown);
        };
      });

      // Reduced motion: draw the scene once, at rest.
      mm.add(MQ.reduce, () => {
        render();
      });

      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope },
  );

  return (
    <section ref={scope} id="collaborate" className="collab" aria-labelledby="collab-title">
      <div className="collab__copy">
        <h2 id="collab-title" className="collab__heading">
          <span>Have something</span>
          <span>to build?</span>
        </h2>
        <p className="collab__sub">
          CRMs, internal tools, storefronts, or software that talks to hardware. Tell me what it needs to do.
        </p>
      </div>

      <div ref={stageRef} className="collab__stage">
        <svg className="collab__svg" aria-hidden="true">
          <g className="collab__strings">
            {ANCHORS.map((a, i) => (
              <path
                key={i}
                ref={(el) => {
                  stringRefs.current[i] = el;
                }}
                className="collab__string"
                style={{ strokeWidth: a.w }}
              />
            ))}
            {ANCHORS.map((_, i) => (
              <circle
                key={`k${i}`}
                ref={(el) => {
                  knotRefs.current[i] = el;
                }}
                className="collab__knot"
                r="2"
              />
            ))}
          </g>
          <g ref={handRef} className="collab__hand">
            <Hand />
          </g>
        </svg>

        <div ref={rigRef} className="collab__rig">
          <div className="collab__shadow" aria-hidden="true" />
          {!open ? (
            <motion.button
              ref={buttonRef}
              type="button"
              className="collab__button"
              layoutId="collab-surface"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              onPointerMove={onButtonMove}
              onPointerLeave={resetTilt}
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileFocus="hover"
              whileTap="tap"
              variants={{
                rest: { y: 0, scale: 1, boxShadow: SHADOW_REST },
                hover: { y: -5, scale: 1.025, boxShadow: SHADOW_LIFT },
                tap: { y: -1, scale: 0.97, boxShadow: SHADOW_REST },
              }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              style={{ rotateX, rotateY, transformPerspective: 900, borderRadius: 999 }}
            >
              <span className="collab__gloss" aria-hidden="true" />
              <motion.span
                className="collab__sweep"
                aria-hidden="true"
                variants={{
                  rest: { x: "-130%", opacity: 0 },
                  hover: { x: "230%", opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
              />
              <motion.span layout="position" className="collab__label">
                LET&rsquo;S COLLABORATE
              </motion.span>
            </motion.button>
          ) : (
            <span className="collab__button collab__button--ghost" aria-hidden="true">
              <span className="collab__label">LET&rsquo;S COLLABORATE</span>
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>{open ? <ContactOverlay onClose={() => setOpen(false)} /> : null}</AnimatePresence>
    </section>
  );
}
