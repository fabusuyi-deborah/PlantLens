"use client";

import { useEffect } from "react";

/** Opens the <details> with this id when the URL points at it (e.g. /sources#photo-credits). */
export function OpenOnHash({ id }: { id: string }) {
  useEffect(() => {
    function open() {
      if (window.location.hash !== `#${id}`) return;
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement) {
        element.open = true;
        element.scrollIntoView();
      }
    }
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [id]);
  return null;
}
