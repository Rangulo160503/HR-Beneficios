// src/components/crud/CrudBlock.jsx
import { useState } from "react";

export default function CrudBlock({ title, tabs }) {
  // tabs: [{ key, label, node }]
  const [active, setActive] = useState(tabs?.[0]?.key);

  return (
    <section className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>

        <nav className="inline-flex rounded-xl bg-white/5 p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition
                ${active === t.key ? "bg-white/15" : "hover:bg-white/10"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="border border-white/10 rounded-xl p-3 sm:p-4">
        {tabs.find(t => t.key === active)?.node}
      </div>
    </section>
  );
}
