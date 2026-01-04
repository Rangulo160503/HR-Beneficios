import {
  beneficioGateway,
  categoriaGateway,
  proveedorGateway,
  beneficioImagenGateway,
} from "./gateways";
import { loadBeneficiosList as loadBeneficiosListUseCase } from "../core/flujo/use-cases/LoadBeneficiosList";
import { loadBeneficiosByProveedor as loadBeneficiosByProveedorUseCase } from "../core/flujo/use-cases/LoadBeneficiosByProveedor";
import { loadCategoriasList as loadCategoriasListUseCase } from "../core/flujo/use-cases/LoadCategoriasList";
import { loadProveedoresList as loadProveedoresListUseCase } from "../core/flujo/use-cases/LoadProveedoresList";
import { getProveedorDetail as getProveedorDetailUseCase } from "../core/flujo/use-cases/GetProveedorDetail";
import { updateProveedor as updateProveedorUseCase } from "../core/flujo/use-cases/UpdateProveedor";
import { getBeneficioDetail as getBeneficioDetailUseCase } from "../core/flujo/use-cases/GetBeneficioDetail";
import { getBenefitCardImage as getBenefitCardImageUseCase } from "../core/flujo/use-cases/GetBenefitCardImage";
import { loadBeneficioImagenes as loadBeneficioImagenesUseCase } from "../core/flujo/use-cases/LoadBeneficioImagenes";
import { createBeneficio as createBeneficioUseCase } from "../core/flujo/use-cases/CreateBeneficio";
import { createBeneficioForProveedor as createBeneficioForProveedorUseCase } from "../core/flujo/use-cases/CreateBeneficioForProveedor";
import { updateBeneficio as updateBeneficioUseCase } from "../core/flujo/use-cases/UpdateBeneficio";
import { deleteBeneficio as deleteBeneficioUseCase } from "../core/flujo/use-cases/DeleteBeneficio";
import { loadAprobacionesPendientes as loadAprobacionesPendientesUseCase } from "../core/flujo/use-cases/LoadAprobacionesPendientes";
import { loadAprobacionesAprobados as loadAprobacionesAprobadosUseCase } from "../core/flujo/use-cases/LoadAprobacionesAprobados";
import { approveBeneficio as approveBeneficioUseCase } from "../core/flujo/use-cases/ApproveBeneficio";
import { rejectBeneficio as rejectBeneficioUseCase } from "../core/flujo/use-cases/RejectBeneficio";
import { setBeneficioDisponible as setBeneficioDisponibleUseCase } from "../core/flujo/use-cases/SetBeneficioDisponible";
import { validateProveedorLogin as validateProveedorLoginUseCase } from "../core/flujo/use-cases/ValidateProveedorLogin";

export const loadBeneficiosList = (options) =>
  loadBeneficiosListUseCase({ beneficioGateway, options });

export const loadBeneficiosByProveedor = ({ proveedorId, options }) =>
  loadBeneficiosByProveedorUseCase({ beneficioGateway, proveedorId, options });

export const loadCategoriasList = (options) =>
  loadCategoriasListUseCase({ categoriaGateway, options });

export const loadProveedoresList = (options) =>
  loadProveedoresListUseCase({ proveedorGateway, options });

export const getProveedorDetail = (proveedorId, options) =>
  getProveedorDetailUseCase({ proveedorGateway, proveedorId, options });

export const updateProveedor = ({ proveedorId, dto, options }) =>
  updateProveedorUseCase({ proveedorGateway, proveedorId, dto, options });

export const getBeneficioDetail = (beneficioId, options) =>
  getBeneficioDetailUseCase({ beneficioGateway, beneficioId, options });

export const getBenefitCardImage = (beneficio) =>
  getBenefitCardImageUseCase({ beneficioGateway, beneficio });

export const loadBeneficioImagenes = (beneficioId, options) =>
  loadBeneficioImagenesUseCase({ beneficioImagenGateway, beneficioId, options });

export const createBeneficio = ({ dto, options }) =>
  createBeneficioUseCase({ beneficioGateway, dto, options });

export const createBeneficioForProveedor = ({ proveedorId, token, dto, options }) =>
  createBeneficioForProveedorUseCase({ beneficioGateway, proveedorId, token, dto, options });

export const updateBeneficio = ({ beneficioId, dto, options }) =>
  updateBeneficioUseCase({ beneficioGateway, beneficioId, dto, options });

export const deleteBeneficio = ({ beneficioId, options }) =>
  deleteBeneficioUseCase({ beneficioGateway, beneficioId, options });

export const loadAprobacionesPendientes = (options) =>
  loadAprobacionesPendientesUseCase({ beneficioGateway, options });

export const loadAprobacionesAprobados = (options) =>
  loadAprobacionesAprobadosUseCase({ beneficioGateway, options });

export const approveBeneficio = ({ beneficioId, options }) =>
  approveBeneficioUseCase({ beneficioGateway, beneficioId, options });

export const rejectBeneficio = ({ beneficioId, options }) =>
  rejectBeneficioUseCase({ beneficioGateway, beneficioId, options });

export const setBeneficioDisponible = ({ beneficioId, disponible, options }) =>
  setBeneficioDisponibleUseCase({ beneficioGateway, beneficioId, disponible, options });

export const validateProveedorLogin = (proveedorId, options) =>
  validateProveedorLoginUseCase({ proveedorGateway, proveedorId, options });
