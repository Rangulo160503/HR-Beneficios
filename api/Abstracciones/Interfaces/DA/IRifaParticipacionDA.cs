using System;
using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IRifaParticipacionDA
    {
        Task<Guid> Crear(RifaParticipacionRequest request);     // core.RifaParticipacion_Insertar
        Task<RifaParticipacionResponse?> Obtener(Guid id);      // core.RifaParticipacion_ObtenerPorId
        Task<IEnumerable<RifaParticipacionListado>> Listar(RifaParticipacionFiltro filtro); // core.RifaParticipacion_Listar
        Task<bool> ActualizarEstado(Guid id, string estado);    // core.RifaParticipacion_ActualizarEstado
    }
}
