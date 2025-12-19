// src/views/ProveedorHome.jsx
import { useEffect, useState } from "react";
import ProveedorBeneficioForm from "../proveedor/components/ProveedorBeneficioForm";
import { BeneficioApi, ProveedorApi } from "../services/adminApi";

export default function ProveedorHome() {
  const [showForm, setShowForm] = useState(false);
  const [proveedorId, setProveedorId] = useState(null);
  const [proveedorNombre, setProveedorNombre] = useState("");
  const [beneficios, setBeneficios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Resolver proveedorId desde URL o localStorage (esto ya lo tenías, solo lo
  // dejo integrado aquí para que quede todo en un solo archivo).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("proveedorId");
    const guidRegex = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

    if (fromUrl && guidRegex.test(fromUrl)) {
      console.log("[Proveedor] proveedorId desde URL:", fromUrl);
      localStorage.setItem("proveedorId", fromUrl);
      setProveedorId(fromUrl);
    } else {
      const stored = localStorage.getItem("proveedorId");
      if (stored && guidRegex.test(stored)) {
        console.log("[Proveedor] usando proveedorId desde localStorage:", stored);
        setProveedorId(stored);
      } else {
        console.warn(
          "[Proveedor] NO hay proveedorId ni en URL ni en localStorage"
        );
        setProveedorId(null);
      }
    }
  }, []);

  // 2) Cargar datos del proveedor (nombre) y sus beneficios cuando ya tenemos proveedorId
  useEffect(() => {
    if (!proveedorId) {
      setLoading(false);
      return;
    }

    let cancel = false;

    (async () => {
      try {
        setLoading(true);

        // Nombre del proveedor para la cabecera
        try {
          const prov = await ProveedorApi.get(proveedorId);
          if (!cancel && prov) {
            setProveedorNombre(prov.nombre || prov.Nombre || "");
          }
        } catch (e) {
          console.warn("[Proveedor] Error obteniendo proveedor:", e);
        }

        // Beneficios de este proveedor
        const data = await BeneficioApi.listByProveedor(proveedorId);
        console.log("[Proveedor] beneficios recibidos:", data);

        if (!cancel) {
          // Opcional: si quieres mostrar solo aprobados (estado === 1)
          const soloAprobados = (data || []).filter(
            (b) => b.estado === 1 || b.estado === "Aprobado"
          );

          setBeneficios(soloAprobados);
        }
      } catch (error) {
        console.error("[Proveedor] Error cargando beneficios:", error);
        if (!cancel) setBeneficios([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [proveedorId]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portal de Proveedor</h1>
            {proveedorNombre && (
              <p className="text-sm text-neutral-400 mt-1">
                Sesión para: <span className="font-medium">{proveedorNombre}</span>
              </p>
            )}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-full px-4 py-2 bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
          >
            Nuevo beneficio
          </button>
        </div>

        {/* Intro */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-neutral-200">
          <p className="text-sm text-neutral-400">
            Aquí podrás crear los beneficios asociados. Usa
            el botón superior para abrir el formulario.
          </p>
        </div>

        {/* Lista de beneficios */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold mb-3">Tus beneficios</h2>

          {loading ? (
            <p className="text-sm text-neutral-500">Cargando beneficios...</p>
          ) : beneficios.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Aún no tienes beneficios creados o aprobados.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {beneficios.map((b) => (
                <article
                  key={b.beneficioId || b.id}
                  className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 space-y-2"
                >
                  <h3 className="font-semibold truncate">
                    {b.titulo || b.Titulo}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {b.descripcion || b.Descripcion}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    ₡{(b.precioCRC || b.PrecioCRC || 0).toLocaleString("es-CR")}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Vigencia:{" "}
                    {b.vigenciaInicio || b.VigenciaInicio} —{" "}
                    {b.vigenciaFin || b.VigenciaFin}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal de creación/edición */}
      {showForm && (
        <ProveedorBeneficioForm
          initial={null}
          onSaved={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
