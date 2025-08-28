const API_BASE = "https://localhost:7141";

console.log("env PROD?", import.meta.env.PROD);

export const fetchBeneficios = async () => {
  const url = `${API_BASE}/api/Beneficio/publicados`;
  console.log("GET:", url);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return await res.json();
};
