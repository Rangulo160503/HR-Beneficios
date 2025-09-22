import Chip from "../common/Chip";

export default function FiltersBar({ selCat, selProv, setSelCat, setSelProv, visibleCats, visibleProvs }) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Categorías */}
      <div
  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar snap-x"
  style={{
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
  }}
>
  {/* chip “Todos …” */}
  <Chip active={!selCat} onClick={()=>setSelCat("")} label="Todas las categorías" />

  {/* tus chips dinámicos */}
  {visibleCats.map((c, i) => (
    <Chip
      key={`cat-${i}`}
      active={selCat && selCat.toLowerCase() === String(c.sel).toLowerCase()}
      onClick={() => setSelCat(selCat === c.sel ? "" : c.sel)}
      label={c.label}
    />
  ))}
</div>
      {/* Proveedores */}
      <div
  className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar snap-x"
  style={{
    WebkitMaskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
    maskImage:
      "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
  }}
>
  <Chip active={!selProv} onClick={()=>setSelProv("")} label="Todos los proveedores" />
  {visibleProvs.map((p, i) => (
    <Chip
      key={`prov-${i}`}
      active={selProv && selProv.toLowerCase() === String(p.sel).toLowerCase()}
      onClick={() => setSelProv(selProv === p.sel ? "" : p.sel)}
      label={p.label}
    />
  ))}
</div>
    </div>
  );
}
