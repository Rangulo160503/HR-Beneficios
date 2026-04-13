using System;
using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IRifaParticipacionDA
    {
        Task<Guid> Crear(RifaParticipacionRequest request);
        Task<RifaParticipacionResponse?> Obtener(Guid id);
        Task<IEnumerable<RifaParticipacionListado>> Listar(RifaParticipacionFiltro filtro);
        Task<bool> ActualizarEstado(Guid id, string estado);
    }
}
