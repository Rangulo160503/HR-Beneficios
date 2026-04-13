
export const cls = (...a) => a.filter(Boolean).join(" ");
export const lower = v => (v == null ? "" : String(v).trim().toLowerCase());
export const slug = s =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 40);
export const keyOf = (prefix, id, label, idx) => {
  const norm = v => (v == null ? "" : String(v).trim());
  const a = norm(id);
  if (a) return `${prefix}-${a}`;
  const b = String(label ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 40);
  if (b) return `${prefix}-${b}`;
  return `${prefix}-${idx}`;
};
export const isNameSel = sel => String(sel).startsWith("name:");
export const nameOfSel = sel => String(sel).slice(5);

const fechaLargaFormatter = new Intl.DateTimeFormat("es-CR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
export const formatFechaLargaES = value => {
  if (!value) return "";
  const normalized = String(value).trim();
  if (!normalized) return "";
  const dateValue = normalized.length === 10 ? `${normalized}T00:00:00` : normalized;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return fechaLargaFormatter.format(date);
};

export const normalizeImage = img => {
  if (!img || typeof img !== "string") return "";
  const s = img.trim();
  if (!s) return "";
  if (/^(https?:|data:|blob:)/i.test(s)) return s;
  const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
  return looksB64 ? `data:image/jpeg;base64,${s.replace(/\s/g, "")}` : s;
};
export const fileToBase64Pure = file =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result || "");
      const i = s.indexOf("base64,");
      res(i >= 0 ? s.slice(i + 7) : s);
    };
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

export function generateAccessToken(byteLength = 32) {
  try {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    let fallback = "";
    for (let i = 0; i < byteLength * 2; i += 1) {
      fallback += Math.floor(Math.random() * 16).toString(16);
    }
    return fallback;
  }
}
export const getProviderPortalBase = () => {
  const target = (import.meta.env.VITE_PROV_PORTAL_TARGET || "local").toLowerCase();
  const baseLocal = String(import.meta.env.VITE_PROV_PORTAL_BASE_LOCAL || "").replace(/\/+$/, "");
  const baseCloud = String(import.meta.env.VITE_PROV_PORTAL_BASE_CLOUD || "").replace(/\/+$/, "");
  if (target === "cloud") return baseCloud;
  return baseLocal;
};
export const buildBadgeLink = (baseUrl, options) => {
  if (!baseUrl) return "";
  const normalizedBase = String(baseUrl).replace(/\/+$/, "");
  if (typeof options === "string" || options == null) {
    const token = typeof options === "string" ? options : undefined;
    return token ? `${normalizedBase}/login?token=${encodeURIComponent(token)}` : "";
  }
  const { proveedorId, accessToken, newFlag } = options;
  if (!proveedorId) return "";
  const params = new URLSearchParams();
  params.set("proveedorId", proveedorId);
  if (newFlag) params.set("new", "1");
  if (accessToken) params.set("token", accessToken);
  return `${normalizedBase}/?${params.toString()}`;
};
