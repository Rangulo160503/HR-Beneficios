using Abstracciones.Modelos;
using Abstracciones.Modelos.Servicios.Beneficios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.DA
{
    public interface IBeneficioDA
    {
        Task<IEnumerable<BeneficioResponse>> Obtener();
        Task<IEnumerable<BeneficioResponse>> ObtenerAprobados();
        Task<IEnumerable<BeneficioResponse>> ObtenerPendientes();
        Task<BeneficioDetalle> Obtener(Guid Id);
        Task<Guid> Agregar(BeneficioRequest beneficio);
        Task<Guid> Editar(Guid Id, BeneficioRequest beneficio);
        Task<Guid> Eliminar(Guid Id);
        Task<Guid> Aprobar(Guid Id, Guid? usuarioId);
        Task<Guid> Rechazar(Guid Id, Guid? usuarioId);
        Task<PagedResult<BeneficioResponse>> ObtenerPorCategoria(Guid categoriaId, int page, int pageSize, string? search);
        Task<int> ReasignarCategoria(Guid fromCategoriaId, Guid toCategoriaId, IEnumerable<Guid>? beneficioIds);
        Task<int> ContarPorCategoria(Guid categoriaId);
        Task<bool> ValidarTokenBadge(Guid proveedorId, string token);
    }
}
