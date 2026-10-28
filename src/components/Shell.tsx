"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Client wrapper: Framer Motion follows the OS reduced-motion setting everywhere. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain" aria-hidden="true" />
      {children}
    </MotionConfig>
  );
}
