// src/core-config/useCases.js

import {
  authGateway,
  beneficioGateway,
  categoriaGateway,
  proveedorGateway,
  toqueBeneficioGateway,
  beneficioImagenGateway,
  rifaParticipacionGateway,
  contactoGateway,
} from "./gateways";

import { API_BASE } from "../services/apiBase";

// use cases existentes (los que ya usabas)
import { loadBeneficiosList as loadBeneficiosListUseCase } from "../core/flujo/use-cases/LoadBeneficiosList";
import { loadCategoriasList as loadCategoriasListUseCase } from "../core/flujo/use-cases/LoadCategoriasList";
import { loadProveedoresList as loadProveedoresListUseCase } from "../core/flujo/use-cases/LoadProveedoresList";
import { getBeneficioDetail as getBeneficioDetailUseCase } from "../core/flujo/use-cases/GetBeneficioDetail";
import { getBenefitCardImage as getBenefitCardImageUseCase } from "../core/flujo/use-cases/GetBenefitCardImage";
import { loadBeneficioImagenes as loadBeneficioImagenesUseCase } from "../core/flujo/use-cases/LoadBeneficioImagenes";
import { registerToqueBeneficio as registerToqueBeneficioUseCase } from "../core/flujo/use-cases/RegisterToqueBeneficio";
import { createRifaParticipacion as createRifaParticipacionUseCase } from "../core/flujo/use-cases/CreateRifaParticipacion";
import { submitContacto as submitContactoUseCase } from "../core/flujo/use-cases/SubmitContacto";
import { loginWithCredentials as loginWithCredentialsUseCase } from "../core/flujo/use-cases/LoginWithCredentials";
import { loginWithToken as loginWithTokenUseCase } from "../core/flujo/use-cases/LoginWithToken";

// Status enum (lo usas en Gate)
import { SessionStatus } from "../core/flujo/use-cases/ValidateSessionAndAuthorize";

/* =========================
 * LISTAS / DETALLES (igual)
 * ========================= */
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

export const submitContacto = ({ url, dto, options }) =>
  submitContactoUseCase({ contactoGateway, url, dto, options });

/* =========================
 * LOGIN (cookie-only)
 * ========================= */
export const loginWithCredentials = ({ usuario, password, options } = {}) =>
  loginWithCredentialsUseCase({
    authGateway,
    // sessionStore NO se usa en cookie-only; lo dejamos undefined
    sessionStore: undefined,
    usuario,
    password,
    defaultRoles: [],
    options: {
      ...(options ?? {}),
      credentials: options?.credentials ?? "include",
    },
  });

export const loginWithToken = ({ token, options } = {}) =>
  loginWithTokenUseCase({
    authGateway,
    sessionStore: undefined,
    token,
    defaultRoles: [],
    options: {
      ...(options ?? {}),
      credentials: options?.credentials ?? "include",
    },
  });

/* =========================
 * VALIDACIÓN (cookie-only)
 * - Llama al backend /api/AdminAuth/me
 * - Si 200 => OK
 * - Si 401 => SHOW_LOGIN
 * - Si 403 => NOT_AUTHORIZED
 * ========================= */
export const validateSessionAndAuthorize = async (options = {}) => {
  try {
    const base = String(API_BASE ?? "").replace(/\/+$/, "");
    const res = await fetch(`${base}/api/AdminAuth/me`, {
      method: "GET",
      credentials: "include", // ✅ manda hr_auth
      headers: { Accept: "application/json" },
      mode: options?.mode ?? "cors",
      signal: options?.signal,
    });

    if (res.status === 401) return { status: SessionStatus.SHOW_LOGIN, session: null };
    if (res.status === 403) return { status: SessionStatus.NOT_AUTHORIZED, session: null };

    if (!res.ok) return { status: SessionStatus.ERROR, error: new Error(`me failed ${res.status}`) };

    const profile = await res.json().catch(() => null);

    // Si llegó aquí, el JWT ya validó Role=Admin en el backend
    return {
      status: SessionStatus.OK,
      session: {
        user: profile,
        roles: ["Admin"],
        cookie: true,
      },
    };
  } catch (error) {
    return { status: SessionStatus.ERROR, error };
  }
};