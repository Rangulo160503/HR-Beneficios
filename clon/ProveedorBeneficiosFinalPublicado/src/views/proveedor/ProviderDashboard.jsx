import { useEffect, useMemo, useState } from "react";
import { Api } from "../../services/api.js";

export default function ProviderDashboard() {
  // ID temporal hasta tener login o sesión real
  

  const [beneficios, setBeneficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("todos"); // todos | activo | inactivo | pendiente

useEffect(() => {
  let cancel = false;
  (async () => {
    setLoading(true);
    try {
      const all = await Api.beneficios.listar(); // trae todo
      // Si quieres filtrar por proveedor específico:
      // const all = (await Api.beneficios.listar()).filter(x => x.proveedorId === proveedorId);

      const mapped = (all || []).map(b => {
        const inicio = b.vigenciaInicio ? new Date(b.vigenciaInicio) : null;
        const fin = b.vigenciaFin ? new Date(b.vigenciaFin) : null;

        // Derivar estado a partir de fechas (no viene en el payload)
        const hoy = new Date();
        let estado = "inactivo";
        if (inicio && fin) {
          if (hoy < inicio) estado = "pendiente";
          else if (hoy >= inicio && hoy <= fin) estado = "activo";
          else estado = "inactivo";
        }

        return {
          id: b.beneficioId,
          proveedorId: b.proveedorId,
          proveedorNombre: b.proveedorNombre,
          categoriaNombre: b.categoriaNombre,
          titulo: b.titulo,
          descripcion: b.descripcion,
          precio: b.precioCRC ?? 0,
          moneda: "CRC",
          vigencia: (inicio && fin)
            ? `${inicio.toLocaleDateString('es-CR')} → ${fin.toLocaleDateString('es-CR')}`
            : "",
          estado,
          vistas: 0, // no viene; déjalo en 0 por ahora
          canjes: 0, // no viene; déjalo en 0 por ahora
          imagenBase64: b.imagen, // por si luego mostramos miniatura
        };
      });

      if (!cancel) setBeneficios(mapped);
    } catch (err) {
      console.error("Error cargando beneficios:", err);
      if (!cancel) setBeneficios([]);
    } finally {
      if (!cancel) setLoading(false);
    }
  })();
  return () => { cancel = true; };
}, []);


  // Filtro por búsqueda y estado
  const filtrados = useMemo(() => {
    let lista = beneficios;
    if (estado !== "todos") lista = lista.filter(b => b.estado === estado);
    if (query.trim()) {
      const q = query.toLowerCase();
      lista = lista.filter(b => (b.titulo || "").toLowerCase().includes(q));
    }
    return lista;
  }, [beneficios, query, estado]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Mis beneficios</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título..."
          className="border rounded px-3 py-1 w-64"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Título</th>
              <th className="p-2 border">Precio</th>
              <th className="p-2 border">Vigencia</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Vistas</th>
              <th className="p-2 border">Canjes</th>
            </tr>
          </thead>
          <tbody>
  {filtrados.map((b) => (
    <tr key={b.id}>
      <td className="p-2 border">{b.titulo}</td>
      <td className="p-2 border">
        {new Intl.NumberFormat("es-CR", { style: "currency", currency: b.moneda }).format(b.precio)}
      </td>
      <td className="p-2 border">{b.vigencia}</td>
      <td className="p-2 border">{b.estado}</td>
      <td className="p-2 border text-center">{b.vistas}</td>
      <td className="p-2 border text-center">{b.canjes}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}
