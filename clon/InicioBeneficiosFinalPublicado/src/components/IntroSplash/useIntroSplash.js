import { useEffect, useState } from "react";

export function useIntroSplash(show, onFinish, onPhaseChange) {
  const [phase, setPhase] = useState("phase-0");
  const [hide, setHide]     = useState(false);

  useEffect(() => {
    if (!show) return;

    setHide(false);
    setPhase("phase-0");

    const t0 = setTimeout(() => setPhase("phase-1"), 700);
    const t1 = setTimeout(() => setPhase("phase-2"), 1400);
    const t2 = setTimeout(() => {
      setHide(true);
      onFinish?.();
    }, 2200);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show, onFinish]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  return { phase, hide };
}