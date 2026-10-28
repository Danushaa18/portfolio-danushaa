"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { Flashlight } from "./Flashlight";
import { Portrait } from "./Portrait";

const current = site.experience[site.experience.length - 1];
const first = site.experience[0];

function Letters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span className="hero-ch-mask" key={i}>
          <span className="hero-ch">{ch}</span>
        </span>
      ))}
    </>
  );
}

/**
 * Rendered twice: once as the readable page, once as the lit layer under the
 * lamp. Identical markup keeps both layers aligned at every breakpoint; the
 * lit variant adds the annotations that only show under the beam.
 */
function Composition({ lit }: { lit?: boolean }) {
  const NameTag = lit ? "div" : "h1";
  return (
    <div className={`hero-comp${lit ? " hero-comp--lit" : ""}`}>
      {lit ? <div className="hero-blueprint" /> : null}

      <p className="hero-kicker mono" data-hero="fade">
        A working file, {first.start} to now
        {lit ? (
          <span className="anno anno--callout anno--kick">
            <span className="anno__line" />
            <span className="anno__label mono">
              B.E. {site.education.degree.replace("Bachelor of Engineering in ", "")}, {site.education.years.split(" – ")[1]},{" "}
              {site.education.grade}
            </span>
          </span>
        ) : null}
      </p>

      <NameTag className="hero-name" data-hero="name" aria-label={lit ? undefined : site.name}>
        <span className="hero-name__row" aria-hidden="true">
          <Letters text={site.firstName.toUpperCase()} />
          {lit ? (
            <span className="anno anno--span">
              <span className="anno__tick" />
              <span className="anno__label mono">
                {first.start} to {current.end.toLowerCase()}: {site.experience.length} roles at 3 companies
              </span>
              <span className="anno__tick" />
            </span>
          ) : null}
        </span>
        <span className="hero-name__row hero-name__row--outline" aria-hidden="true" data-hero="wipe">
          {site.initials}
        </span>
      </NameTag>

      <figure className="hero-portrait" data-hero="portrait">
        <div className="hero-portrait__inner">
          <Portrait priority />
        </div>
        <span className="reg reg--tl" aria-hidden="true" />
        <span className="reg reg--tr" aria-hidden="true" />
        <span className="reg reg--bl" aria-hidden="true" />
        <span className="reg reg--br" aria-hidden="true" />
        {lit ? (
          <>
            <span className="crosshair" aria-hidden="true" />
            <figcaption className="anno anno--below mono">Field portrait, {site.location}</figcaption>
          </>
        ) : null}
      </figure>

      <p className="hero-lede serif" data-hero="fade">
        {site.role} who began with control and calibration software for industrial measurement
        machines, and now builds the CRMs, HRMS and finance systems that teams run on.
        {lit ? (
          <span className="anno anno--note mono">
            Now: {current.company}, GGM-CRM on Next.js + Supabase
          </span>
        ) : null}
      </p>

      <dl className="hero-meta" data-hero="fade">
        <div>
          <dt className="mono">Now</dt>
          <dd>
            {current.role}, {current.company}
          </dd>
        </div>
        <div>
          <dt className="mono">Before</dt>
          <dd>Nelgates Technologies, Zentron Labs</dd>
        </div>
        <div>
          <dt className="mono">Based in</dt>
          <dd>{site.location}</dd>
        </div>
      </dl>
    </div>
  );
}

export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.set("[data-hero]", { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-rule", { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "power3.inOut" })
          .fromTo(".hero-ch", { yPercent: 112 }, { yPercent: 0, duration: 1.3, stagger: 0.045 }, "-=0.9")
          .fromTo(
            "[data-hero='portrait']",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut", clearProps: "clipPath" },
            "-=1.2",
          )
          .from(".hero-portrait__inner", { scale: 1.18, duration: 2.2, ease: "power2.out" }, "<")
          .fromTo(
            "[data-hero='wipe']",
            { clipPath: "inset(0% 100% 0% 0%)" },
            // Cleared afterwards so the annotation beside the initials is not clipped.
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath" },
            "-=1.6",
          )
          .from(".reg", { scale: 0, duration: 0.6, stagger: 0.06, ease: "back.out(2)" }, "-=0.8")
          .from("[data-hero='fade']", { y: 18, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power2.out" }, "-=0.9")
          .from(".lamp__controls", { autoAlpha: 0, duration: 0.6 }, "-=0.4");

        // Quiet parallax as the opening leaves the viewport.
        gsap.to(".hero-name", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-portrait__inner", {
          yPercent: 9,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add(MQ.reduce, () => {
        gsap.set("[data-hero]", { autoAlpha: 1, clearProps: "clipPath" });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="hero" id="top" aria-label="Introduction">
      <div className="hero-rule" aria-hidden="true" />
      <Flashlight
        className="hero-lamp"
        base={<Composition />}
        reveal={<Composition lit />}
        radius={260}
        rest={{ x: 0.7, y: 0.4 }}
        hint="Move your cursor, or tap and drag, to inspect"
        showLabel="Show the annotations"
        hideLabel="Hide the annotations"
      />
    </section>
  );
}
