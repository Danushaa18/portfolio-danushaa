"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";

/** Experience, told in order: first role at the top, current role last. */
export function Story() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ".story__progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: { trigger: ".story__list", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          },
        );

        gsap.utils.toArray<HTMLElement>(".role").forEach((role) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: role, start: "top 78%", once: true },
            defaults: { ease: "power3.out" },
          });
          tl.fromTo(
            role.querySelector(".role__company"),
            { clipPath: "inset(0% 0% 100% 0%)", yPercent: 30 },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 1.1, ease: "expo.out" },
          )
            .from(role.querySelector(".role__dates"), { x: -16, autoAlpha: 0, duration: 0.7 }, "<0.1")
            .from(role.querySelector(".role__pin"), { scale: 0, duration: 0.5, ease: "back.out(3)" }, "<")
            .from(role.querySelectorAll(".role__title, .role__points li"), {
              y: 14,
              autoAlpha: 0,
              duration: 0.7,
              stagger: 0.07,
            }, "<0.2");
        });

        gsap.fromTo(".story__heading .outline", { xPercent: 5 }, {
          xPercent: -1,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="story" className="story section-dark" aria-labelledby="story-title">
      <div className="story__aside">
        <h2 id="story-title" className="story__heading display">
          <span>From the machine</span>
          <span className="outline">to the CRM</span>
        </h2>
        <p className="story__intro serif">
          Four roles since 2023. The first were spent next to servo motors and sensors, where software
          has to agree with the physical world. The latest are spent where it has to agree with an
          invoice total.
        </p>
      </div>

      <div className="story__list">
        <span className="story__rail" aria-hidden="true">
          <span className="story__progress" />
        </span>
        <ol className="story__roles">
        {site.experience.map((job) => (
          <li className="role" key={`${job.company}-${job.start}`}>
            <span className="role__pin" aria-hidden="true" />
            <p className="role__dates mono">
              <time>{job.start}</time> to <time>{job.end}</time>
            </p>
            <h3 className="role__company display">{job.company}</h3>
            <p className="role__title serif">{job.role}</p>
            <ul className="role__points serif">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}
