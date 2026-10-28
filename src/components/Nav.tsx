"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";

const items = [
  { id: "story", label: "Story" },
  { id: "work", label: "Work" },
  { id: "outcomes", label: "Outcomes" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "collaborate", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best: string | null = null;
        let max = 0;
        seen.forEach((ratio, id) => {
          if (ratio > max) {
            max = ratio;
            best = id;
          }
        });
        setActive(best);
      },
      { threshold: [0, 0.2, 0.4, 0.6], rootMargin: "-30% 0px -40% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav" data-on-light={active === "collaborate" && !open ? "true" : "false"}>
      <a className="nav__mark" href="#top" aria-label={`${site.name}, back to top`}>
        D<span>MS</span>
      </a>

      <nav aria-label="Sections" className="nav__desktop">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
                {item.label}
                {active === item.id ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="nav__underline"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.button
        type="button"
        className="nav__menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
      >
        {open ? "Close" : "Menu"}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            className="nav__sheet"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.4 }}
                >
                  <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
