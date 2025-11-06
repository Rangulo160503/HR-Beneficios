import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Api } from "../../services/api";

export default function BeneficioDetalle() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const dto = await Api.beneficios.obtener(id); // <-- GET /api/Beneficio/{id}
        if (!cancel) setItem(dto);
      } catch (e) {
        console.error(e);
        if (!cancel) setErr("No se pudo cargar el beneficio.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [id]);

  if (loading) return <div className="p-6 text-zinc-200">Cargando…</div>;
  if (err) return <div className="p-6 text-red-300">{err}</div>;
  if (!item) return <div className="p-6 text-zinc-200">No encontrado.</div>;

  // adapta a tus nombres reales:
  const img = item.imagen ? `data:image/jpeg;base64,${item.imagen}` : null;
  const inicio = item.vigenciaInicio && new Date(item.vigenciaInicio);
  const fin = item.vigenciaFin && new Date(item.vigenciaFin);

  return (
    <div className="p-6 text-zinc-200">
      <div className="mb-4">
        <Link to="/beneficios" className="text-emerald-400 hover:underline">← Volver</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          <div className="aspect-[16/9] bg-zinc-800">
            {img ? (
              <img src={img} alt={item.titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">Sin imagen</div>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h1 className="text-xl font-semibold">{item.titulo}</h1>
            <p className="text-zinc-400">{item.descripcion}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Proveedor</div>
            <div className="font-medium">{item.proveedorNombre}</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Categoría</div>
            <div className="font-medium">{item.categoriaNombre}</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Precio</div>
            <div className="font-semibold">
              {new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" })
                .format(item.precioCRC ?? 0)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm text-zinc-400">Vigencia</div>
            <div className="font-medium">
              {inicio && fin
                ? `${inicio.toLocaleDateString("es-CR")} — ${fin.toLocaleDateString("es-CR")}`
                : "No especificada"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
