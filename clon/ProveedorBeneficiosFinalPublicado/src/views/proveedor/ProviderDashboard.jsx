import { useEffect, useMemo, useState } from "react";
import { deleteBeneficio, loadBeneficiosList } from "../../core-config/useCases";
import { useNavigate } from "react-router-dom";

export default function ProviderDashboard() {
  // --- estado UI ---
  const [beneficios, setBeneficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("todos"); // todos | activo | inactivo | pendiente

  // --- helpers de estilo/imagen (no filtran nada) ---
  const estadoClasses = (estado) => {
    switch (estado) {
      case "activo": return "bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-600/40";
      case "pendiente": return "bg-amber-600/20 text-amber-300 ring-1 ring-amber-600/40";
      default: return "bg-zinc-600/20 text-zinc-300 ring-1 ring-zinc-600/40";
    }
  };

  const asImgSrc = (base64) => (base64 ? `data:image/jpeg;base64,${base64}` : null);
  const navigate = useNavigate();
  
  // --- carga de datos (SIN filtro por proveedorId) ---
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const all = await loadBeneficiosList(); // ← trae todo

        // mapeo con tus nombres de campos reales
        const mapped = (all || []).map((b) => {
          const inicio = b.vigenciaInicio ? new Date(b.vigenciaInicio) : null;
          const fin = b.vigenciaFin ? new Date(b.vigenciaFin) : null;
          const hoy = new Date();

          let est = "inactivo";
          if (inicio && fin) {
            if (hoy < inicio) est = "pendiente";
            else if (hoy >= inicio && hoy <= fin) est = "activo";
          }

          return {
            id: b.beneficioId,
            proveedorNombre: b.proveedorNombre,
            categoriaNombre: b.categoriaNombre,
            titulo: b.titulo,
            descripcion: b.descripcion,
            precio: b.precioCRC ?? 0,
            moneda: "CRC",
            vigencia:
              inicio && fin
                ? `${inicio.toLocaleDateString("es-CR")} → ${fin.toLocaleDateString("es-CR")}`
                : "",
            estado: est,
            vistas: 0,
            canjes: 0,
            imagenBase64: b.imagen,
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

  // --- filtros locales (buscador + estado) ---
  const filtrados = useMemo(() => {
    let lista = beneficios;
    if (estado !== "todos") lista = lista.filter((b) => b.estado === estado);
    if (query.trim()) {
      const q = query.toLowerCase();
      lista = lista.filter((b) => (b.titulo || "").toLowerCase().includes(q));
    }
    return lista;
  }, [beneficios, query, estado]);

  async function onDelete(id) {
  if (!confirm("¿Eliminar este beneficio? Esta acción no se puede deshacer.")) return;
  try {
    await deleteBeneficio({ beneficioId: id });
    // Optimista: quita del estado sin recargar
    setBeneficios(prev => prev.filter(x => x.id !== id));
  } catch (e) {
    console.error(e);
    alert("No se pudo eliminar.");
  }
}

  // --- UI (grid de tarjetas tipo catálogo) ---
  return (
    <div className="p-6 text-zinc-200">
      <h1 className="text-2xl font-semibold mb-4">Mis beneficios</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título..."
          className="border border-zinc-700 bg-zinc-900/50 rounded px-3 py-1 w-64 focus:outline-none focus:ring focus:ring-emerald-500/30"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border border-zinc-700 bg-zinc-900/50 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-emerald-500/30"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
          <option value="pendiente">Pendientes</option>
        </select>
        <button
  className="mb-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
  onClick={() => navigate("/beneficios/nuevo")}
>
  + Nuevo beneficio
</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : filtrados.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No hay beneficios que coincidan.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((b) => {
            const img = asImgSrc(b.imagenBase64);
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors overflow-hidden shadow-md"
              >
                {/* Imagen */}
                <div className="aspect-[16/9] bg-zinc-800 relative">
                  {img ? (
                    <img
                      src={img}
                      alt={b.titulo}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    {b.proveedorNombre && (
                      <span className="font-medium text-zinc-300">{b.proveedorNombre}</span>
                    )}
                    {b.categoriaNombre && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {b.categoriaNombre}
                      </span>
                    )}
                  </div>

                  <h3 className="text-zinc-100 font-semibold leading-tight line-clamp-2">
                    {b.titulo}
                  </h3>

                  <div className="flex items-center justify-between text-sm">
                    <div className="font-semibold text-zinc-100">
                      {new Intl.NumberFormat("es-CR", {
                        style: "currency",
                        currency: b.moneda || "CRC",
                      }).format(b.precio || 0)}
                    </div>
                    <div className="text-zinc-400">{b.vigencia}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${estadoClasses(b.estado)}`}>
                      {b.estado}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span>👁 {b.vistas ?? 0}</span>
                      <span>🏷 {b.canjes ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
  <button
    className="flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm py-2"
    onClick={() => navigate(`/beneficios/${b.id}`)}
  >
    Ver
  </button>
  <button
    className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm px-3"
    onClick={() => navigate(`/beneficios/${b.id}/editar`)}
  >
    Editar
  </button>
  <button
    className="rounded-lg bg-red-700/80 hover:bg-red-700 text-white text-sm px-3"
    onClick={() => onDelete(b.id)}
  >
    Eliminar
  </button>
</div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
