import { useEffect } from "react";

/**
 * Static brush cursor — applies a paintbrush PNG as the native CSS cursor
 * across the whole site. No JS animation, no DOM overlay, zero runtime cost.
 * Disabled on touch devices (coarse pointer) which keep the system default.
 */
export function BrushCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const style = document.createElement("style");
    // Hotspot (4, 95) anchors the bristle tip (bottom-left of the image)
    // to the actual click point. Fallback to `auto` if the image fails to load.
    style.innerHTML = `
      *, *::before, *::after {
        cursor: url('/brush-cursor.png') 3 30, auto !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}