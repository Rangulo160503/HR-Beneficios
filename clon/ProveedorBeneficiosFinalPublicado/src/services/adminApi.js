import { Api } from "./api";

export const BeneficioApi = {
  create: (payload) => Api.beneficios.agregar(payload),
  update: (id, payload) => Api.beneficios.editar(id, payload),
  get: (id) => Api.beneficios.obtener(id),
  listByProveedor: (proveedorId) => Api.beneficios.listarPorProveedorFront(proveedorId),
  remove: (id) => Api.beneficios.eliminar(id),
};

export const CategoriaApi = {
  list: () => Api.categorias.listar(),
  get: (id) => Api.categorias.obtener(id),
};

export const ProveedorApi = {
  get: (id) => Api.proveedores.obtener(id),
};
