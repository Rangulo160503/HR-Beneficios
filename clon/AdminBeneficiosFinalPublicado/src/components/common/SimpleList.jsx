export default function SimpleList({ rows, prop, onRename, onDelete }) {
  const keyOf = (prefix, r, i) =>
    `${prefix}-${String(r.id ?? i)}-${String(r[prop] ?? "").slice(0, 40)}`;
  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 divide-y divide-white/10">
      {rows.map((r, i) => (
        <div key={keyOf("row", r, i)} className="px-3 py-3 flex items-center gap-3">
          <div className="flex-1">{r[prop]}</div>
          <button
            onClick={() => onRename(r)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white text-sm font-medium"
          >
            Renombrar
          </button>
          <button
            onClick={() => onDelete(r)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm"
          >
            Eliminar
          </button>
        </div>
      ))}
      {rows.length === 0 && (
        <div className="px-3 py-3 text-white/60 text-sm">Sin elementos.</div>
      )}
    </div>
  );
}
