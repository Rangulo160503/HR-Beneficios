using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IRifaParticipacionFlujo
    {
        Task<int> Crear(RifaParticipacionRequest request);
        Task<RifaParticipacionResponse?> Obtener(int id);
        Task<PagedResult<RifaParticipacionResponse>> Listar(RifaParticipacionFiltro filtro);
        Task<bool> ActualizarEstado(int id, string estado);
    }
}
