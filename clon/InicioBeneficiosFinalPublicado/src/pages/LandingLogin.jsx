import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { landingSessionStore } from "../core-config/sessionStores";

export default function LandingLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = landingSessionStore.getSession();
    if (session?.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    landingSessionStore.setSession({
      token: "landing-session",
      tsLogin: Date.now(),
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Bienvenido</h1>
        <p className="text-sm text-white/70">
          Ingresa para explorar las opciones de acceso de HR Beneficios.
        </p>
        <button
          onClick={handleContinue}
          className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-white/90"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
