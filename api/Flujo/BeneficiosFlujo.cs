using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Modelos;

namespace Flujo
{
    public class BeneficiosFlujo : IBeneficioFlujo
    {
        private readonly IBeneficioDA _beneficioDA;

        public BeneficiosFlujo(IBeneficioDA beneficioDA)
        {
            _beneficioDA = beneficioDA ?? throw new ArgumentNullException(nameof(beneficioDA));
        }

        public async Task<Guid> Agregar(BeneficioRequest beneficio)
        {
            var id = await _beneficioDA.Agregar(beneficio);
            return id;
        }

        public async Task<Guid> Editar(Guid id, BeneficioRequest beneficio)
        {
            var result = await _beneficioDA.Editar(id, beneficio);
            return result;
        }

        public async Task<Guid> Eliminar(Guid id)
        {
            var result = await _beneficioDA.Eliminar(id);
            return result;
        }

        public async Task<IEnumerable<BeneficioResponse>> Obtener()
        {
            var items = await _beneficioDA.Obtener();
            return items;
        }
        public async Task<IEnumerable<BeneficioResponse>> ObtenerAprobados()
        {
            var items = await _beneficioDA.ObtenerAprobados();
            return items;
        }

        public async Task<IEnumerable<BeneficioResponse>> ObtenerPendientes()
        {
            var items = await _beneficioDA.ObtenerPendientes();
            return items;
        }

        public async Task<BeneficioDetalle> Obtener(Guid id)
        {
            var beneficio = await _beneficioDA.Obtener(id);
            return beneficio;
        }
        public async Task<Guid> Aprobar(Guid id, Guid? usuarioId)
        {
            return await _beneficioDA.Aprobar(id, usuarioId);
        }

        public async Task<Guid> Rechazar(Guid id, Guid? usuarioId)
        {
            return await _beneficioDA.Rechazar(id, usuarioId);
        }

        public async Task<PagedResult<BeneficioResponse>> ObtenerPorCategoria(Guid categoriaId, int page, int pageSize, string? search)
        {
            return await _beneficioDA.ObtenerPorCategoria(categoriaId, page, pageSize, search);
        }

        public async Task<int> ReasignarCategoria(Guid fromCategoriaId, Guid toCategoriaId, IEnumerable<Guid>? beneficioIds)
        {
            return await _beneficioDA.ReasignarCategoria(fromCategoriaId, toCategoriaId, beneficioIds);
        }

        public async Task<int> ContarPorCategoria(Guid categoriaId)
        {
            return await _beneficioDA.ContarPorCategoria(categoriaId);
        }

        public async Task<bool> ValidarTokenBadge(Guid proveedorId, string token)
        {
            return await _beneficioDA.ValidarTokenBadge(proveedorId, token);
        }
    }
}
