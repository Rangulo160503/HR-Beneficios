// src/components/AlphabetBar.jsx
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export default function AlphabetBar({ value, onChange }) {
  return (
    <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onChange("")}
        className={`px-3 py-1.5 rounded-full text-sm ${!value ? "bg-emerald-500 text-black" : "bg-white/10"}`}
      >
        Todas
      </button>
      {ABC.map((ch) => (
        <button
          key={ch}
          onClick={() => onChange(ch)}
          className={`px-3 py-1.5 rounded-full text-sm ${
            value === ch ? "bg-emerald-500 text-black" : "bg-white/10"
          }`}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}
