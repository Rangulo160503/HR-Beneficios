export function normalizeBeneficioId(raw) {
  const id =
    raw?.id ??
    raw?.Id ??
    raw?.beneficioId ??
    raw?.BeneficioId ??
    raw?.beneficio?.id ??
    raw?.beneficio?.Id;

  const fixed = String(id ?? "").trim();
  return fixed || "";
}

export function normalizeBeneficio(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const id = normalizeBeneficioId(raw);
  return {
    ...raw,
    id: id || undefined,
    beneficioId: id || undefined,
  };
}

export function normalizeBeneficiosList(rawList) {
  return Array.isArray(rawList) ? rawList.map(normalizeBeneficio) : [];
}

export function pickBeneficioImage(raw) {
  if (!raw || typeof raw !== "object") return "";
  return (
    raw?.imagenUrl ??
    raw?.ImagenUrl ??
    raw?.imagenBase64 ??
    raw?.ImagenBase64 ??
    raw?.imagen ??
    raw?.Imagen ??
    ""
  );
}

export function normalizeImageSource(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (/^(data:|https?:|blob:)/i.test(s)) return s;
  const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
  if (looksB64) return `data:image/jpeg;base64,${s.replace(/\s/g, "")}`;
  return s;
}

export function normalizeToqueSummary(raw) {
  const arr = Array.isArray(raw)
    ? raw
    : Object.entries(raw || {}).map(([beneficioId, count]) => ({
        beneficioId,
        count,
      }));

  return arr.reduce((acc, curr) => {
    const id = normalizeBeneficioId(curr);
    if (!id) return acc;
    acc[id] = curr?.count ?? curr?.Count ?? 0;
    return acc;
  }, {});
}

export function mergeBeneficiosWithSummary(beneficios, summary) {
  const base = Array.isArray(beneficios) ? beneficios : [];
  return base.map((beneficio) => {
    const normalized = normalizeBeneficio(beneficio);
    const total = summary?.[normalized?.beneficioId] ?? 0;
    return { ...beneficio, totalToques: total };
  });
}

export function normalizeToqueAnalytics(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const series = Array.isArray(raw.series)
    ? raw.series
    : Array.isArray(raw.Series)
      ? raw.Series
      : [];
  return {
    ...raw,
    series,
  };
}
