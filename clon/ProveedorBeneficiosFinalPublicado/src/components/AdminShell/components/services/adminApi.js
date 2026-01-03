import { Api } from "../../../services/api";

const AprobacionesApi = {
  pendientes: () => Api.beneficios.aprobacionesPendientes(),
  aprobados: () => Api.beneficios.aprobacionesAprobados(),
  aprobar: (id) => Api.beneficios.aprobar(id),
  rechazar: (id) => Api.beneficios.rechazar(id),
  toggleDisponible: (id, disponible) => Api.beneficios.cambiarDisponible(id, disponible),
  obtenerDetalle: (id) => Api.beneficios.obtener(id),
  editar: (id, payload) => Api.beneficios.editar(id, payload),
};

export default AprobacionesApi;