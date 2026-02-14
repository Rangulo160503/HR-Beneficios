// src/utils/images.js
export const EMBED_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
    <rect width="100%" height="100%" fill="#2a2a2a"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          fill="#9ca3af" font-family="sans-serif" font-size="24">Sin imagen</text>
  </svg>`);

export function withBase(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${import.meta.env.VITE_API_BASE ?? ""}${url}`;
}

/** Devuelve un src siempre válido (placeholder si viene vacío/roto). */
export function safeSrc(src) {
  return src && String(src).trim() ? src : EMBED_PLACEHOLDER;
}

export function toImgSrc(img, { fallback = EMBED_PLACEHOLDER, mime = "image/jpeg" } = {}) {
  if (!img && img !== 0) return fallback;

  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return fallback;
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
    if (looksB64) return `data:${mime};base64,${s.replace(/\s/g, "")}`;
    return withBase(s);
  }

  if (Array.isArray(img)) {
    try {
      const u = new Uint8Array(img);
      let bin = "";
      for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
      return `data:${mime};base64,${btoa(bin)}`;
    } catch {
      return fallback;
    }
  }

  if (img instanceof Uint8Array) {
    try {
      let bin = "";
      for (let i = 0; i < img.length; i++) bin += String.fromCharCode(img[i]);
      return `data:${mime};base64,${btoa(bin)}`;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

/** Busca el campo de imagen más común en un objeto de API. */
export function extractImage(obj) {
  if (!obj) return "";
  const cands = [
    obj.imagenBase64, obj.ImagenBase64,
    obj.imagenThumb, obj.ImagenThumb,
    obj.imagenUrl, obj.ImagenUrl,
    obj.imagen, obj.Imagen,
    obj.imageUrl, obj.ImageUrl,
    obj.logoUrl, obj.LogoUrl,
    obj?.imagen?.url, obj?.Imagen?.Url,
    obj?.image?.url, obj?.Image?.Url,
    obj?.imagenes?.[0]?.url, obj?.Imagenes?.[0]?.Url,
    obj?.images?.[0]?.url, obj?.Images?.[0]?.Url,
  ];
  const hit = cands.find((x) => x != null && x !== "");
  return toImgSrc(hit);
}

export const normalizeImage = (img) => {
  if (!img || typeof img !== "string") return "";
  const s = img.trim();
  if (!s) return "";
  if (/^(https?:|data:|blob:)/i.test(s)) return s;
  const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(s) && s.replace(/\s/g, "").length > 50;
  return looksB64 ? `data:image/jpeg;base64,${s.replace(/\s/g, "")}` : s;
};

export const fileToBase64Pure = (file) => new Promise((res, rej) => {
  const fr = new FileReader();
  fr.onload = () => {
    const s = String(fr.result || "");
    const i = s.indexOf("base64,");
    res(i >= 0 ? s.slice(i + 7) : s);
  };
  fr.onerror = rej;
  fr.readAsDataURL(file);
});
