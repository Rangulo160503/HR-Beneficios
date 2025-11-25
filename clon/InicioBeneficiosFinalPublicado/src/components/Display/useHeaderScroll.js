// src/components/Display/useHeaderScroll.js
import { useEffect, useRef, useState } from "react";
import { HEADER_HEIGHTS } from "./constants";

export function useHeaderScroll() {
  const [headerY, setHeaderY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const lastYRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;
      const delta = currentY - lastY;
      lastYRef.current = currentY;

      const HEADER_H =
        window.innerWidth >= 640 ? HEADER_HEIGHTS.DESK : HEADER_HEIGHTS.MOBILE;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setHeaderY((prev) => {
          let next = prev;
          if (delta > 0) next = Math.max(-HEADER_H, prev - Math.min(delta, HEADER_H));
          else if (delta < 0) next = Math.min(0, prev - Math.max(delta, -HEADER_H));
          if (currentY < 8) next = 0;
          return next;
        });
        setScrolled(currentY > 2);
      });
    };

    lastYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { headerY, scrolled };
}
