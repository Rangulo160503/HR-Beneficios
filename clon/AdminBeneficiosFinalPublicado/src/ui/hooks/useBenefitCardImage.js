import { useEffect, useRef, useState } from "react";
import { getBenefitCardImage } from "../../core-config/useCases";

export function useBenefitCardImage(beneficio) {
  const containerRef = useRef(null);
  const hasRequestedRef = useRef(false);
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSrc("");
    setLoading(false);
    hasRequestedRef.current = false;
  }, [beneficio]);

  useEffect(() => {
    let cancelled = false;
    let observer;

    const loadImage = async () => {
      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;
      setLoading(true);
      try {
        const resolved = await getBenefitCardImage(beneficio);
        if (!cancelled) setSrc(resolved || "");
      } catch {
        if (!cancelled) setSrc("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const node = containerRef.current;
    if (!node) {
      loadImage();
      return () => {};
    }

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            loadImage();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(node);
    } else {
      loadImage();
    }

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
    };
  }, [beneficio]);

  return { containerRef, src, loading };
}
