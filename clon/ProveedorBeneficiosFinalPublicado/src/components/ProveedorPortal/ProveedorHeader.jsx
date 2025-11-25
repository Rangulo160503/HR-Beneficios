// src/components/ProveedorPortal/ProveedorHeader.jsx
export default function ProveedorHeader({ title }) {
  return (
    <header className="h-16 flex items-center px-6 border-b border-neutral-800 bg-black/80 backdrop-blur">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
