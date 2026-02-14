import { API_BASE } from "../services/apiBase";
import { adminSessionStore } from "./sessionStores";
import { AuthGatewayFetch } from "../core/infrastructure/auth/AuthGatewayFetch";
import { createFetchClient } from "../core/infrastructure/http/createFetchClient";
import { BeneficioGatewayFetch } from "../core/infrastructure/http/BeneficioGatewayFetch";
import { CategoriaGatewayFetch } from "../core/infrastructure/http/CategoriaGatewayFetch";
import { ProveedorGatewayFetch } from "../core/infrastructure/http/ProveedorGatewayFetch";
import { ToqueBeneficioGatewayFetch } from "../core/infrastructure/http/ToqueBeneficioGatewayFetch";

const fetchClient = createFetchClient({
  baseUrl: API_BASE,
  sessionStore: adminSessionStore,
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  },
});

export const beneficioGateway = new BeneficioGatewayFetch(fetchClient);
export const categoriaGateway = new CategoriaGatewayFetch(fetchClient);
export const proveedorGateway = new ProveedorGatewayFetch(fetchClient);
export const toqueBeneficioGateway = new ToqueBeneficioGatewayFetch(fetchClient);
export const authGateway = new AuthGatewayFetch({
  baseUrl: API_BASE,
  credentialsPath: "/api/AdminAuth/login",
  tokenPath: "/api/Proveedor/login",
});
