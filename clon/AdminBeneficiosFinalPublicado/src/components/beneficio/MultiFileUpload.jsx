import { useRef } from "react";

export default function MultiFileUpload({ onPickMany }) {
  const inputRef = useRef(null);

  function open() {
    inputRef.current?.click();
  }

  async function handleChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onPickMany(files);
    e.target.value = ""; // para permitir volver a subir las mismas
  }

  return (
    <div>
      <button
        type="button"
        onClick={open}
        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
      >
        Subir fotos adicionales
      </button>

      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
