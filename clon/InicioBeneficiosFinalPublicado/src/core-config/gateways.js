import { API_BASE } from "../services/apiBase";
import { landingSessionStore } from "./sessionStores";
import { createFetchClient } from "../core/infrastructure/http/createFetchClient";
import { BeneficioGatewayFetch } from "../core/infrastructure/http/BeneficioGatewayFetch";
import { CategoriaGatewayFetch } from "../core/infrastructure/http/CategoriaGatewayFetch";
import { ProveedorGatewayFetch } from "../core/infrastructure/http/ProveedorGatewayFetch";
import { ToqueBeneficioGatewayFetch } from "../core/infrastructure/http/ToqueBeneficioGatewayFetch";
import { BeneficioImagenGatewayFetch } from "../core/infrastructure/http/BeneficioImagenGatewayFetch";
import { RifaParticipacionGatewayFetch } from "../core/infrastructure/http/RifaParticipacionGatewayFetch";
import { ContactoGatewayFetch } from "../core/infrastructure/http/ContactoGatewayFetch";
import { AuthGatewayFetch } from "../core/infrastructure/auth/AuthGatewayFetch";

const fetchClient = createFetchClient({
  baseUrl: API_BASE,
  sessionStore: landingSessionStore,
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
export const beneficioImagenGateway = new BeneficioImagenGatewayFetch(fetchClient);
export const rifaParticipacionGateway = new RifaParticipacionGatewayFetch(fetchClient);
export const contactoGateway = new ContactoGatewayFetch();
export const authGateway = new AuthGatewayFetch({
  baseUrl: API_BASE,
  credentialsPath: "/api/AdminAuth/login",
  tokenPath: "/api/Proveedor/login",
});
