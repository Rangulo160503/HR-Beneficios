import {
  authGateway,
  beneficioGateway,
  categoriaGateway,
  proveedorGateway,
  toqueBeneficioGateway,
} from "./gateways";
import { adminSessionStore } from "./sessionStores";
import { loadBeneficiosList as loadBeneficiosListUseCase } from "../core/flujo/use-cases/LoadBeneficiosList";
import { loadCategoriasList as loadCategoriasListUseCase } from "../core/flujo/use-cases/LoadCategoriasList";
import { loadProveedoresList as loadProveedoresListUseCase } from "../core/flujo/use-cases/LoadProveedoresList";
import { getBeneficioDetail as getBeneficioDetailUseCase } from "../core/flujo/use-cases/GetBeneficioDetail";
import { getBenefitCardImage as getBenefitCardImageUseCase } from "../core/flujo/use-cases/GetBenefitCardImage";
import { loadToqueAnalytics as loadToqueAnalyticsUseCase } from "../core/flujo/use-cases/LoadToqueAnalytics";
import { loadToqueSummary as loadToqueSummaryUseCase } from "../core/flujo/use-cases/LoadToqueSummary";
import { saveBeneficio as saveBeneficioUseCase } from "../core/flujo/use-cases/SaveBeneficio";
import { deleteBeneficio as deleteBeneficioUseCase } from "../core/flujo/use-cases/DeleteBeneficio";
import { loginWithCredentials as loginWithCredentialsUseCase } from "../core/flujo/use-cases/LoginWithCredentials";
import { loginWithToken as loginWithTokenUseCase } from "../core/flujo/use-cases/LoginWithToken";
import { validateSessionAndAuthorize as validateSessionAndAuthorizeUseCase } from "../core/flujo/use-cases/ValidateSessionAndAuthorize";

export const loadBeneficiosList = () =>
  loadBeneficiosListUseCase({ beneficioGateway });

export const loadCategoriasList = () =>
  loadCategoriasListUseCase({ categoriaGateway });

export const loadProveedoresList = () =>
  loadProveedoresListUseCase({ proveedorGateway });

export const getBeneficioDetail = (beneficioId) =>
  getBeneficioDetailUseCase({ beneficioGateway, beneficioId });

export const getBenefitCardImage = (beneficio) =>
  getBenefitCardImageUseCase({ beneficioGateway, beneficio });

export const loadToqueAnalytics = ({ beneficioId, range }) =>
  loadToqueAnalyticsUseCase({
    toqueBeneficioGateway,
    beneficioId,
    range,
  });

export const loadToqueSummary = ({ range, beneficios }) =>
  loadToqueSummaryUseCase({
    toqueBeneficioGateway,
    range,
    beneficios,
  });

export const saveBeneficio = ({ dto, editing }) =>
  saveBeneficioUseCase({ beneficioGateway, dto, editing });

export const deleteBeneficio = ({ beneficioId }) =>
  deleteBeneficioUseCase({ beneficioGateway, beneficioId });

export const loginWithCredentials = ({ usuario, password, options }) =>
  loginWithCredentialsUseCase({
    authGateway,
    sessionStore: adminSessionStore,
    usuario,
    password,
    defaultRoles: ["Admin"],
    options,
  });

export const loginWithToken = ({ token, options }) =>
  loginWithTokenUseCase({
    authGateway,
    sessionStore: adminSessionStore,
    token,
    defaultRoles: ["Admin"],
    options,
  });

export const validateSessionAndAuthorize = (options) =>
  validateSessionAndAuthorizeUseCase({
    sessionStore: adminSessionStore,
    ...options,
  });
