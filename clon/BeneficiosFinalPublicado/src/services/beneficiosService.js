const API_BASE_URL = import.meta.env.PROD
  ? "https://hr-beneficios-api-hxeshwbedrbndmc5.centralus-01.azurewebsites.net"
  : "/api";

console.log("¿Es producción?", import.meta.env.PROD);
console.log("Llamando a:", `${API_BASE_URL}/api/Beneficio`);

export const fetchBeneficios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Beneficio`);
    if (!response.ok) {
      throw new Error("Error al obtener beneficios");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al cargar beneficios:", error);
    return [];
  }
};
