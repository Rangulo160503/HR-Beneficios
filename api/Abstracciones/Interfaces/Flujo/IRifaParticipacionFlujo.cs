using System;
using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IRifaParticipacionFlujo
    {
        Task<Guid> Crear(RifaParticipacionRequest request);
        Task<RifaParticipacionResponse?> Obtener(Guid id);
        Task<PagedResult<RifaParticipacionResponse>> Listar(RifaParticipacionFiltro filtro);
        Task<bool> ActualizarEstado(Guid id, string estado);
    }
}
