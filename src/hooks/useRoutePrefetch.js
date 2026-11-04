import { useEffect } from "react";
import { prefetchPath } from "../routes/pageLoaders";

/** Prefetch a page chunk only when a visitor shows intent to open its link. */
export function useRoutePrefetch() {
  useEffect(() => {
    const warmFromEvent = (e) => {
      const el = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!el || el.hasAttribute("download")) return;
      if (el.origin && el.origin !== window.location.origin) return;
      prefetchPath(el.getAttribute("href"));
    };

    document.addEventListener("pointerover", warmFromEvent, { passive: true });
    document.addEventListener("touchstart", warmFromEvent, { passive: true });

    return () => {
      document.removeEventListener("pointerover", warmFromEvent);
      document.removeEventListener("touchstart", warmFromEvent);
    };
  }, []);
}
