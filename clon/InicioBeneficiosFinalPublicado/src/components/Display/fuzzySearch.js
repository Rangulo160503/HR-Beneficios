// src/components/Display/fuzzySearch.js
import { SP_SYNONYMS } from "./constants";

export function normalize(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(s = "") {
  return normalize(s).split(" ").filter(Boolean);
}

export function editDistance(a, b) {
  a = normalize(a); b = normalize(b);
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  const dp = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => (i===0 ? j : j===0 ? i : 0))
  );
  for (let i=1;i<=m;i++){
    for (let j=1;j<=n;j++){
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + cost
      );
    }
  }
  return dp[m][n];
}

export function expandWithSynonyms(tokens) {
  const out = new Set(tokens);
  for (const t of tokens) {
    const key = normalize(t);
    if (SP_SYNONYMS[key]) {
      for (const s of SP_SYNONYMS[key]) out.add(s);
    }
    for (const [base, list] of Object.entries(SP_SYNONYMS)) {
      if (list.some(x => normalize(x) === key)) out.add(base);
    }
  }
  return Array.from(out);
}

export function tokenMatchesField(token, field) {
  if (!field) return 0;
  const f = normalize(field);
  const t = normalize(token);
  if (!t || !f) return 0;
  if (f.includes(t)) return 3;
  if (f.startsWith(t)) return 2;
  const d = editDistance(t, f.slice(0, Math.min(f.length, t.length + 2)));
  if (d <= 1) return 2;
  if (d === 2) return 1;
  return 0;
}

export function scoreItem(item, qTokens) {
  if (!qTokens.length) return 1;
  const catName = item.categoriaNombre || item.categoria?.nombre || item.categoria?.titulo;
  const provName = item.proveedorNombre || item.proveedor?.nombre || item.proveedor;
  const fields = [
    item.titulo, item.descripcion, item.condiciones,
    catName, provName
  ].filter(Boolean);

  let score = 0;
  for (const tk of qTokens) {
    let best = 0;
    for (const field of fields) {
      best = Math.max(best, tokenMatchesField(tk, field));
      if (best === 3) break;
    }
    score += best;
  }
  return score;
}
