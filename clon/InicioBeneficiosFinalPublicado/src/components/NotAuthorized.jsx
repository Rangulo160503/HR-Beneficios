export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full space-y-3 text-center">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="text-sm text-white/70">
          No cuentas con permisos para acceder a esta sección.
        </p>
      </div>
    </div>
  );
}
