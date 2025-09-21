export const cls = (...a) => a.filter(Boolean).join(" ");
export const lower = (v) => (v == null ? "" : String(v).trim().toLowerCase());
export const slug = (s) => String(s ?? "").toLowerCase().trim()
  .replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").slice(0, 40);
export const keyOf = (prefix, id, label, idx) => {
  const norm = (v)=> (v == null ? "" : String(v).trim());
  const a = norm(id); if (a) return `${prefix}-${a}`;
  const b = (String(label ?? "").toLowerCase().trim()
    .replace(/\s+/g,"-").replace(/[^a-z0-9-_]/g,"").slice(0,40));
  if (b) return `${prefix}-${b}`;
  return `${prefix}-${idx}`;
};
export const isNameSel = (sel) => String(sel).startsWith("name:");
export const nameOfSel = (sel) => String(sel).slice(5);
