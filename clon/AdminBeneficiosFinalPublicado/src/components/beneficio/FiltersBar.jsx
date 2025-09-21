import Chip from "../common/Chip";

export default function FiltersBar({ selCat, selProv, setSelCat, setSelProv, visibleCats, visibleProvs }) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        <Chip label="Todas las categorías" active={!selCat} onClick={() => setSelCat("")} />
        {visibleCats.map(c => (
          <Chip key={`cat-${c.id}`} label={c.label} active={selCat === c.id}
                onClick={() => setSelCat(selCat === c.id ? "" : c.id)} />
        ))}
      </div>
      {/* Proveedores */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        <Chip label="Todos los proveedores" active={!selProv} onClick={() => setSelProv("")} />
        {visibleProvs.map(p => (
          <Chip key={`prov-${p.id}`} label={p.label} active={selProv === p.id}
                onClick={() => setSelProv(selProv === p.id ? "" : p.id)} />
        ))}
      </div>
    </div>
  );
}
