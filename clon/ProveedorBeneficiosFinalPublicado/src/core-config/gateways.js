import { API_BASE } from "../services/apiBase";
import { providerSessionStore } from "./sessionStores";
import { AuthGatewayFetch } from "../core/infrastructure/auth/AuthGatewayFetch";
import { createFetchClient } from "../core/infrastructure/http/createFetchClient";
import { BeneficioGatewayFetch } from "../core/infrastructure/http/BeneficioGatewayFetch";
import { CategoriaGatewayFetch } from "../core/infrastructure/http/CategoriaGatewayFetch";
import { ProveedorGatewayFetch } from "../core/infrastructure/http/ProveedorGatewayFetch";
import { BeneficioImagenGatewayFetch } from "../core/infrastructure/http/BeneficioImagenGatewayFetch";

const fetchClient = createFetchClient({
  baseUrl: API_BASE,
  sessionStore: providerSessionStore,
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  },
});

export const beneficioGateway = new BeneficioGatewayFetch(fetchClient);
export const categoriaGateway = new CategoriaGatewayFetch(fetchClient);
export const proveedorGateway = new ProveedorGatewayFetch(fetchClient);
export const beneficioImagenGateway = new BeneficioImagenGatewayFetch(fetchClient);
export const authGateway = new AuthGatewayFetch({
  baseUrl: API_BASE,
  credentialsPath: "/api/AdminAuth/login",
  tokenPath: "/api/Proveedor/login",
});
