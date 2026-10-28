"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { site, type Project } from "@/content/site";
import { ProjectVisual } from "./ProjectVisual";

const isDev = process.env.NODE_ENV !== "production";

function ProjectLinks({ project }: { project: Project }) {
  if (project.links.length === 0) {
    return isDev ? (
      <p className="config-placeholder mono">Add live or repository links for {project.title} in src/content/site.ts</p>
    ) : null;
  }
  return (
    <ul className="case__links">
      {project.links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function CaseFile({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`case case--${project.id}`} aria-labelledby={`case-${project.id}`}>
      <div className="case__visual">
        <ProjectVisual kind={project.visual} title={project.title} />
      </div>
      <div className="case__text">
        <p className="case__context mono">{project.context}</p>
        <h3 id={`case-${project.id}`} className="case__title display">
          {project.title}
        </h3>
        <dl className="case__brief serif">
          <div>
            <dt>Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>What I built</dt>
            <dd>{project.solution}</dd>
          </div>
        </dl>
        {project.contribution.length > 0 ? (
          <ul className="case__contribution serif">
            {project.contribution.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
        <p className="case__stack mono">
          <span className="visually-hidden">Built with </span>
          {project.stack.join(" / ")}
        </p>
        <ProjectLinks project={project} />
      </div>
      <span className="case__count mono" aria-hidden="true">
        {index + 1}/{site.projects.length}
      </span>
    </article>
  );
}

export function Work() {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const prepareDraw = (root: Element | Document) => {
        const strokes = gsap.utils.toArray<SVGGeometryElement>(
          root.querySelectorAll(".draw:not(.pv-line--dash)"),
        );
        gsap.set(strokes, { attr: { pathLength: 1 }, strokeDasharray: 1, strokeDashoffset: 1 });
        return strokes;
      };

      mm.add({ desktop: MQ.desktop, motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const section = scope.current!;
        const trackEl = track.current!;
        const cases = gsap.utils.toArray<HTMLElement>(".case", section);

        if (desktop) {
          const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
          const scroller = gsap.to(trackEl, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          cases.forEach((c) => {
            const strokes = prepareDraw(c);
            const tl = gsap.timeline({
              scrollTrigger: { trigger: c, containerAnimation: scroller, start: "left 78%", once: true },
            });
            tl.fromTo(
              c.querySelector(".case__visual"),
              { clipPath: "inset(0% 0% 0% 100%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
            )
              .to(strokes, { strokeDashoffset: 0, duration: 1.4, stagger: 0.04, ease: "power2.inOut" }, "-=0.5")
              .from(c.querySelectorAll(".case__text > *"), { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" }, "<");
          });

          gsap.from(".work__intro .outline", {
            xPercent: 20,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: () => `+=${window.innerWidth}`, scrub: true },
          });
        } else {
          cases.forEach((c) => {
            const strokes = prepareDraw(c);
            gsap
              .timeline({ scrollTrigger: { trigger: c, start: "top 75%", once: true } })
              .fromTo(
                c.querySelector(".case__visual"),
                { clipPath: "inset(100% 0% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut" },
              )
              .to(strokes, { strokeDashoffset: 0, duration: 1.2, stagger: 0.03, ease: "power2.inOut" }, "-=0.4");
          });
        }
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="work" className="work section-dark" aria-labelledby="work-title">
      <div ref={track} className="work__track">
        <header className="work__intro">
          <h2 id="work-title" className="display">
            <span>Case</span>
            <span className="outline">files</span>
          </h2>
          <p className="serif">
            Five systems, from a CRM that is still being built to a marketplace that cut out the middle
            layer. Each one is drawn the way it works.
          </p>
          <p className="work__cue mono" aria-hidden="true">
            Keep scrolling
          </p>
        </header>
        {site.projects.map((p, i) => (
          <CaseFile project={p} index={i} key={p.id} />
        ))}
      </div>
    </section>
  );
}
