import {
  authGateway,
  beneficioGateway,
  categoriaGateway,
  proveedorGateway,
  toqueBeneficioGateway,
  beneficioImagenGateway,
  rifaParticipacionGateway,
} from "./gateways";
import { clientSessionStore } from "./sessionStores";
import { loadBeneficiosList as loadBeneficiosListUseCase } from "../core/flujo/use-cases/LoadBeneficiosList";
import { loadCategoriasList as loadCategoriasListUseCase } from "../core/flujo/use-cases/LoadCategoriasList";
import { loadProveedoresList as loadProveedoresListUseCase } from "../core/flujo/use-cases/LoadProveedoresList";
import { getBeneficioDetail as getBeneficioDetailUseCase } from "../core/flujo/use-cases/GetBeneficioDetail";
import { getBenefitCardImage as getBenefitCardImageUseCase } from "../core/flujo/use-cases/GetBenefitCardImage";
import { loadBeneficioImagenes as loadBeneficioImagenesUseCase } from "../core/flujo/use-cases/LoadBeneficioImagenes";
import { registerToqueBeneficio as registerToqueBeneficioUseCase } from "../core/flujo/use-cases/RegisterToqueBeneficio";
import { createRifaParticipacion as createRifaParticipacionUseCase } from "../core/flujo/use-cases/CreateRifaParticipacion";
import { loginWithCredentials as loginWithCredentialsUseCase } from "../core/flujo/use-cases/LoginWithCredentials";
import { loginWithToken as loginWithTokenUseCase } from "../core/flujo/use-cases/LoginWithToken";
import { validateSessionAndAuthorize as validateSessionAndAuthorizeUseCase } from "../core/flujo/use-cases/ValidateSessionAndAuthorize";

export const loadBeneficiosList = (options) =>
  loadBeneficiosListUseCase({ beneficioGateway, options });

export const loadCategoriasList = (options) =>
  loadCategoriasListUseCase({ categoriaGateway, options });

export const loadProveedoresList = (options) =>
  loadProveedoresListUseCase({ proveedorGateway, options });

export const getBeneficioDetail = (beneficioId, options) =>
  getBeneficioDetailUseCase({ beneficioGateway, beneficioId, options });

export const getBenefitCardImage = (beneficio) =>
  getBenefitCardImageUseCase({ beneficioGateway, beneficio });

export const loadBeneficioImagenes = (beneficioId, options) =>
  loadBeneficioImagenesUseCase({ beneficioImagenGateway, beneficioId, options });

export const registerToqueBeneficio = ({ beneficioId, origen, options }) =>
  registerToqueBeneficioUseCase({ toqueBeneficioGateway, beneficioId, origen, options });

export const createRifaParticipacion = ({ dto, options }) =>
  createRifaParticipacionUseCase({ rifaParticipacionGateway, dto, options });

export const loginWithCredentials = ({ usuario, password, options }) =>
  loginWithCredentialsUseCase({
    authGateway,
    sessionStore: clientSessionStore,
    usuario,
    password,
    defaultRoles: ["Client"],
    options,
  });

export const loginWithToken = ({ token, options }) =>
  loginWithTokenUseCase({
    authGateway,
    sessionStore: clientSessionStore,
    token,
    defaultRoles: ["Client"],
    options,
  });

export const validateSessionAndAuthorize = (options) =>
  validateSessionAndAuthorizeUseCase({
    sessionStore: clientSessionStore,
    ...options,
  });
