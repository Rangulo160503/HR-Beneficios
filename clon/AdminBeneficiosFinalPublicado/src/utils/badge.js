export function generateAccessToken(byteLength = 32) {
  try {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.warn("No se pudo usar getRandomValues, usando generador inseguro", err);
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
