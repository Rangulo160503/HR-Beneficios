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

export const buildBadgeLink = (origin, token) =>
  token ? `${origin}/login?token=${token}` : "";
