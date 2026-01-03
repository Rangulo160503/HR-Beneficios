import { Api } from "./api";

export const BeneficioApi = {
  create: (payload) => Api.beneficios.agregar(payload),
  update: (id, payload) => Api.beneficios.editar(id, payload),
  get: (id) => Api.beneficios.obtener(id),
  listByProveedor: (proveedorId) => Api.beneficios.listarPorProveedorFront(proveedorId),
};

export const CategoriaApi = {
  list: () => Api.categorias.listar(),
  get: (id) => Api.categorias.obtener(id),
};

export const ProveedorApi = {
  list: () => Api.proveedores.listar(),
  get: (id) => Api.proveedores.obtener(id),
};

export const BeneficioImagenApi = {
  listByBeneficio: (beneficioId) => Api.imagenes.listarPorBeneficio(beneficioId),
  get: (imagenId) => Api.imagenes.detalle(imagenId),
  create: (body) => Api.imagenes.crear(body),
  update: (imagenId, body) => Api.imagenes.editar(imagenId, body),
  remove: (imagenId) => Api.imagenes.eliminar(imagenId),
};