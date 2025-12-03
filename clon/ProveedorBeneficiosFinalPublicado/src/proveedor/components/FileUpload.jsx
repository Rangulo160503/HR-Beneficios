import React, { useState } from "react";

export default function FileUpload({ fileUrl, onPick }) {
  const [name, setName] = useState("");

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="relative inline-flex">
        <input
          type="file"
          accept="image/*"
          className="peer sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            setName(f ? f.name : "");
            if (onPick) await onPick(f ?? null);
          }}
        />
        <span className="cursor-pointer rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 px-3 py-2 text-sm font-medium">
          {fileUrl ? "Cambiar" : "Elegir archivo"}
        </span>
      </label>
      <span className="text-white/70 text-sm truncate max-w-[60ch]">
        {name || (fileUrl ? "1 archivo seleccionado" : "Ningún archivo seleccionado")}
      </span>
    </div>
  );
}