// src/views/ProveedorHome.jsx
import { useCallback, useEffect, useState } from "react";
import ProveedorBeneficioForm from "../proveedor/components/ProveedorBeneficioForm";
import { getProveedorDetail, loadBeneficiosByProveedor } from "../core-config/useCases";
import { providerSessionStore } from "../core-config/sessionStores";

export default function ProveedorHome() {
  const [showForm, setShowForm] = useState(false);
  const [proveedorId, setProveedorId] = useState(null);
  const [proveedorNombre, setProveedorNombre] = useState("");
  const [beneficios, setBeneficios] = useState([]);
  const [selectedBeneficio, setSelectedBeneficio] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Resolver proveedorId desde URL o SessionStore (esto ya lo tenías, solo lo
  // dejo integrado aquí para que quede todo en un solo archivo).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("proveedorId");
    const token = params.get("token");
    const guidRegex = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

    if (fromUrl && guidRegex.test(fromUrl)) {
      console.log("[Proveedor] proveedorId desde URL:", fromUrl);
      providerSessionStore.setSession({ proveedorId: fromUrl, token });
      setProveedorId(fromUrl);
    } else {
      const storedSession = providerSessionStore.getSession();
      if (storedSession?.proveedorId && guidRegex.test(storedSession.proveedorId)) {
        console.log(
          "[Proveedor] usando proveedorId desde SessionStore:",
          storedSession.proveedorId
        );
        setProveedorId(storedSession.proveedorId);
      } else {
        console.warn(
          "[Proveedor] NO hay proveedorId ni en URL ni en SessionStore"
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
          const prov = await getProveedorDetail(proveedorId);
          if (!cancel && prov) {
            setProveedorNombre(prov.nombre || prov.Nombre || "");
          }
        } catch (e) {
          console.warn("[Proveedor] Error obteniendo proveedor:", e);
        }

        // Beneficios de este proveedor
        const data = await loadBeneficiosByProveedor({ proveedorId });
        console.log("[Proveedor] beneficios recibidos:", data);

        if (!cancel) {
          await loadBeneficios(proveedorId);
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
  }, [proveedorId, loadBeneficios]);

  const handleNuevo = () => {
    setSelectedBeneficio(null);
    setShowForm(true);
  };

  const handleEditar = (beneficio) => {
    setSelectedBeneficio(beneficio);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBeneficio(null);
  };

  const handleSaved = async () => {
    if (proveedorId) {
      await loadBeneficios(proveedorId);
    }
    handleCloseForm();
  };

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
            onClick={handleNuevo}
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
  <div className="flex items-start justify-between gap-3">
    <h3 className="font-semibold truncate">
      {b.titulo || b.Titulo}
    </h3>

    <button
      type="button"
      className="shrink-0 text-xs px-3 py-1 rounded-full border border-neutral-700 text-neutral-200 hover:bg-neutral-800"
      onClick={() => handleEditar(b)}
    >
      Editar
    </button>
  </div>

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
          initial={selectedBeneficio}
          onSaved={handleSaved}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
