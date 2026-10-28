"use client";

import { useSyncExternalStore } from "react";

function subscribeQuery(query: string) {
  return (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** Live boolean for a media query. Server snapshot is `false`. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Rough heuristic for devices where continuous effects should be trimmed:
 * few cores, little memory, or the user asked to save data.
 */
export function isLowPowerDevice() {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4 || Boolean(nav.connection?.saveData);
}
