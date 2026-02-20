// src/views/ProveedorHome.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import ProveedorBeneficioForm from "../proveedor/components/ProveedorBeneficioForm";
import { BeneficioApi, ProveedorApi } from "../services/adminApi";

export default function ProveedorHome() {
  const [showForm, setShowForm] = useState(false);
  const [proveedorId, setProveedorId] = useState(null);
  const [proveedorNombre, setProveedorNombre] = useState("");
  const [beneficios, setBeneficios] = useState([]);
  const [allBeneficios, setAllBeneficios] = useState([]);
const [filtroEstado, setFiltroEstado] = useState("aprobado");
  const [selectedBeneficio, setSelectedBeneficio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cache simple para no pedir el detalle cada vez que re-renderiza
  const [imgCache, setImgCache] = useState(() => new Map());

  const normalizeId = (b) => b?.beneficioId ?? b?.BeneficioId ?? b?.id ?? b?.Id ?? null;

  const buildImgSrc = (rawImg) => {
    if (!rawImg) return null;

    // Si ya viene como data url, úsalo tal cual
    if (typeof rawImg === "string" && rawImg.startsWith("data:image")) return rawImg;

    // Detectar mime básico por firma
    const mime =
      rawImg?.startsWith("iVBOR") ? "image/png" :
      rawImg?.startsWith("/9j/") ? "image/jpeg" :
      "image/jpeg";

    return `data:${mime};base64,${rawImg}`;
  };

  const hydrateImagenes = useCallback(async (items, cancelRef) => {
    // Pedimos detalle solo para los que no tienen imagen en el listado
    const toFetch = (items || []).filter((b) => {
      const id = normalizeId(b);
      if (!id) return false;

      const raw =
        b.imagen ?? b.Imagen ?? b.imagenBase64 ?? b.ImagenBase64 ?? null;

      // ya venía en listado
      if (raw) return false;

      // ya está cacheada
      if (imgCache.has(id)) return false;

      return true;
    });

    if (toFetch.length === 0) return;

    // Concurrencia limitada para no saturar (4 a la vez)
    const limit = 4;
    let idx = 0;

    const localUpdates = new Map();

    const worker = async () => {
      while (idx < toFetch.length) {
        const current = toFetch[idx++];
        const id = normalizeId(current);
        if (!id) continue;

        try {
          const detalle = await BeneficioApi.get(id); // GET /api/Beneficio/{id}
          const raw = detalle?.imagen ?? detalle?.Imagen ?? null;
          if (raw) localUpdates.set(id, raw);
        } catch {
          // noop
        }

        if (cancelRef?.current) return;
      }
    };

    await Promise.all(Array.from({ length: Math.min(limit, toFetch.length) }, worker));

    if (cancelRef?.current) return;

    if (localUpdates.size > 0) {
      // 1) actualizar cache
      setImgCache((prev) => {
        const next = new Map(prev);
        for (const [k, v] of localUpdates.entries()) next.set(k, v);
        return next;
      });

      // 2) “inyectar” imagen en beneficios para que el UI se actualice
      setBeneficios((prev) =>
        prev.map((b) => {
          const id = normalizeId(b);
          if (!id) return b;
          const cached = localUpdates.get(id);
          return cached ? { ...b, imagen: cached } : b;
        })
      );
    }
  }, [imgCache]);

  const loadBeneficios = useCallback(async (id) => {
    const data = await BeneficioApi.listByProveedor(id);
    console.log("Unicos:", [...new Set((data || []).map(b => b.estado ?? b.Estado))]);

    console.log("[Proveedor] beneficios recibidos:", data);

    const all = data || [];

// Guardar TODO para poder filtrar después
setAllBeneficios(all);

// Mantener UX: pintar rápido con el filtro inicial (aprobado)
const inicial = all.filter(
  (b) => b.estado === 1 || b.estado === "Aprobado"
);

setBeneficios(inicial);


    // Luego completar imágenes desde el detalle (solo frontend)
    const cancelRef = { current: false };
    await hydrateImagenes(inicial, cancelRef);
  }, [hydrateImagenes]);

  // 1) Resolver proveedorId desde URL o localStorage
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
        console.warn("[Proveedor] NO hay proveedorId ni en URL ni en localStorage");
        setProveedorId(null);
      }
    }
  }, []);

  // 2) Cargar datos del proveedor y beneficios
  useEffect(() => {
    if (!proveedorId) {
      setLoading(false);
      return;
    }

    let cancel = false;

    (async () => {
      try {
        setLoading(true);

        // Nombre del proveedor
        try {
          const prov = await ProveedorApi.get(proveedorId);
          if (!cancel && prov) setProveedorNombre(prov.nombre || prov.Nombre || "");
        } catch (e) {
          console.warn("[Proveedor] Error obteniendo proveedor:", e);
        }

        // Beneficios del proveedor
        if (!cancel) await loadBeneficios(proveedorId);
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

    // 3) Re-filtrar cuando cambie el botón
  useEffect(() => {
    const all = allBeneficios || [];

    let filtrados = all;

    if (filtroEstado === "aprobado") {
      filtrados = all.filter((b) => b.estado === 1 || b.estado === "Aprobado");
    } else if (filtroEstado === "pendiente") {
      filtrados = all.filter((b) => b.estado === 0 || b.estado === "Pendiente");
    } else if (filtroEstado === "rechazado") {
      filtrados = all.filter((b) => b.estado === 2 || b.estado === "Rechazado");
    } else if (filtroEstado === "todos") {
      filtrados = all;
    }

    setBeneficios(filtrados);

    const cancelRef = { current: false };
    hydrateImagenes(filtrados, cancelRef);

    return () => {
      cancelRef.current = true;
    };
  }, [allBeneficios, filtroEstado, hydrateImagenes]);


  const handleNuevo = () => {
    setSelectedBeneficio(null);
    setShowForm(true);
  };

  const handleEditar = (beneficio) => {
    // Blindar id consistente
    const beneficioId = normalizeId(beneficio);
    setSelectedBeneficio(beneficioId ? { ...beneficio, beneficioId } : beneficio);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBeneficio(null);
  };

  const handleSaved = async () => {
    if (proveedorId) await loadBeneficios(proveedorId);
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
                Sesión para:{" "}
                <span className="font-medium">{proveedorNombre}</span>
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
            Aquí podrás crear los beneficios asociados. Usa el botón superior para abrir el formulario.
          </p>
        </div>

        {/* Lista de beneficios */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold mb-3">Tus beneficios</h2>

          <div className="flex flex-wrap gap-2 mb-3">
  <button
    type="button"
    onClick={() => setFiltroEstado("aprobado")}
    className={
      "px-3 py-1 rounded-full text-xs border " +
      (filtroEstado === "aprobado"
        ? "bg-emerald-500 text-black border-emerald-500"
        : "border-neutral-700 text-neutral-200 hover:bg-neutral-800")
    }
  >
    Aprobados
  </button>

  <button
    type="button"
    onClick={() => setFiltroEstado("pendiente")}
    className={
      "px-3 py-1 rounded-full text-xs border " +
      (filtroEstado === "pendiente"
        ? "bg-amber-400 text-black border-amber-400"
        : "border-neutral-700 text-neutral-200 hover:bg-neutral-800")
    }
  >
    Pendientes
  </button>

  <button
    type="button"
    onClick={() => setFiltroEstado("rechazado")}
    className={
      "px-3 py-1 rounded-full text-xs border " +
      (filtroEstado === "rechazado"
        ? "bg-red-400 text-black border-red-400"
        : "border-neutral-700 text-neutral-200 hover:bg-neutral-800")
    }
  >
    Rechazados
  </button>

  <button
    type="button"
    onClick={() => setFiltroEstado("todos")}
    className={
      "px-3 py-1 rounded-full text-xs border " +
      (filtroEstado === "todos"
        ? "bg-neutral-200 text-black border-neutral-200"
        : "border-neutral-700 text-neutral-200 hover:bg-neutral-800")
    }
  >
    Todos
  </button>
</div>


          {loading ? (
            <p className="text-sm text-neutral-500">Cargando beneficios...</p>
          ) : beneficios.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Aún no tienes beneficios creados o aprobados.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {beneficios.map((b) => {
                const beneficioId = normalizeId(b);

                const rawImg =
                  b.imagen ??
                  b.Imagen ??
                  b.imagenBase64 ??
                  b.ImagenBase64 ??
                  (beneficioId ? imgCache.get(beneficioId) : null) ??
                  null;

                const imgSrc = buildImgSrc(rawImg);

                return (
                  <article
                    key={beneficioId || b.beneficioId || b.id}
                    className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={b.titulo || b.Titulo || "Imagen del beneficio"}
                            className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shrink-0"
                            loading="lazy"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-neutral-800 bg-neutral-900 shrink-0 grid place-items-center text-neutral-600 text-xs">
                            Sin imagen
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {b.titulo || b.Titulo}
                          </h3>
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {b.descripcion || b.Descripcion}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="shrink-0 text-xs px-3 py-1 rounded-full border border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                        onClick={() => handleEditar(b)}
                      >
                        Editar
                      </button>
                    </div>

                    <p className="text-sm font-medium">
  {(b.precioDesde ?? b.PrecioDesde) ? "A partir de " : ""}
  ₡{(b.precioCRC || b.PrecioCRC || 0).toLocaleString("es-CR")}
</p>

                    <p className="text-xs text-neutral-500">
                      Vigencia: {b.vigenciaInicio || b.VigenciaInicio} —{" "}
                      {b.vigenciaFin || b.VigenciaFin}
                    </p>
                  </article>
                );
              })}
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
