export const normalizeImage = (img) => {
  if (!img || typeof img !== "string") return "";
  const s = img.trim(); if (!s) return "";
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
