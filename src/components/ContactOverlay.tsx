"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";

const isDev = process.env.NODE_ENV !== "production";

const contentVariants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.45, staggerChildren: 0.06, delayChildren: 0.3 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};
const itemVariants = { hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0 } };

export function ContactOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { email } = site.contact;
  const projectMail = `mailto:${email}?subject=${encodeURIComponent("Starting a project")}&body=${encodeURIComponent(
    "Hi Danushaa,\n\nHere is what I would like to build:\n\nTimeline:\nBudget:\n",
  )}`;

  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="contact" role="presentation">
      <motion.div
        className="contact__backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        ref={panelRef}
        className="contact__panel"
        layoutId="collab-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        style={{ borderRadius: 32 }}
        transition={{ type: "spring", stiffness: 210, damping: 28 }}
      >
        <motion.div className="contact__inner" variants={contentVariants} initial="hidden" animate="shown" exit="exit">
          <div className="contact__top">
            <motion.p className="contact__kicker mono" variants={itemVariants}>
              {site.name}, {site.location}
            </motion.p>
            <button ref={closeRef} type="button" className="contact__close" onClick={onClose}>
              <span aria-hidden="true" className="contact__close-x" />
              Close
            </button>
          </div>

          <motion.h2 id="contact-title" className="contact__title display" variants={itemVariants}>
            Let&rsquo;s build it
          </motion.h2>

          <motion.ul className="contact__links" variants={itemVariants}>
            <li>
              <span className="mono">Email</span>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {site.links.linkedin ? (
              <li>
                <span className="mono">LinkedIn</span>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer">
                  {site.links.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </li>
            ) : null}
            {site.links.github ? (
              <li>
                <span className="mono">GitHub</span>
                <a href={site.links.github} target="_blank" rel="noreferrer">
                  {site.links.github.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </li>
            ) : isDev ? (
              <li className="config-placeholder">
                <span className="mono">GitHub</span>
                <span>Set links.github in src/content/site.ts</span>
              </li>
            ) : null}
          </motion.ul>

          <motion.a
            className="contact__cta"
            href={projectMail}
            variants={itemVariants}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a project
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
