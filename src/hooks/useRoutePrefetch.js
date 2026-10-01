import { useEffect } from "react";
import { prefetchAllPaths, prefetchPath } from "../routes/pageLoaders";

const IDLE_TIMEOUT = 2000;

/**
 * Route chunks ko click se pehle hi load kar lo:
 * 1. Page khulte hi idle time mein saare public route chunks warm kar deta hai
 * 2. Kisi bhi link par hover / touch karte hi uska chunk fetch ho jata hai
 * Isse link click karte hi page render ho jata hai — loader flash nahi.
 */
export function useRoutePrefetch() {
  useEffect(() => {
    const warmFromEvent = (e) => {
      const el = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!el) return;
      if (el.hasAttribute("download")) return;
      if (el.origin && el.origin !== window.location.origin) return;
      prefetchPath(el.getAttribute("href"));
    };

    let idleId;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(prefetchAllPaths, { timeout: IDLE_TIMEOUT });
    } else {
      idleId = setTimeout(prefetchAllPaths, 600);
    }

    document.addEventListener("pointerover", warmFromEvent, { passive: true });
    document.addEventListener("touchstart", warmFromEvent, { passive: true });

    return () => {
      document.removeEventListener("pointerover", warmFromEvent);
      document.removeEventListener("touchstart", warmFromEvent);
      if (typeof window.cancelIdleCallback === "function" && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);
}
