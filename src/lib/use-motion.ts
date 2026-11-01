"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/** Whether a media query matches. False during server render. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Calls `tick` every `ms` while `running`, skipping ticks while the tab is hidden. */
export function useInterval(tick: () => void, ms: number, running: boolean) {
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (!document.hidden) tick();
    }, ms);
    return () => window.clearInterval(id);
  }, [tick, ms, running]);
}
