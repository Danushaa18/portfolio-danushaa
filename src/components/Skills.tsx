"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";

/** Skills set like the index of a technical manual, grouped by layer of a system. */
export function Skills() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>(".skill-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } })
            .from(row.querySelector(".skill-row__rule"), { scaleX: 0, transformOrigin: "left", duration: 0.9, ease: "power3.inOut" })
            .from(row.querySelector(".skill-row__group"), { yPercent: 100, duration: 0.8, ease: "expo.out" }, "-=0.5")
            .from(row.querySelectorAll(".skill-row__items li"), { autoAlpha: 0, y: 10, stagger: 0.03, duration: 0.4 }, "-=0.5");
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="skills" className="skills section-dark" aria-labelledby="skills-title">
      <h2 id="skills-title" className="skills__title display">
        Index <span className="outline">of tools</span>
      </h2>
      <div className="skills__rows">
        {site.skills.map((s) => (
          <div className="skill-row" key={s.group}>
            <span className="skill-row__rule" aria-hidden="true" />
            <h3 className="skill-row__group display">
              <span>{s.group}</span>
            </h3>
            <ul className="skill-row__items serif">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
