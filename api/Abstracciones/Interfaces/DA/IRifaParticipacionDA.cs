using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IRifaParticipacionDA
    {
        Task<int> Crear(RifaParticipacionRequest request);     // core.RifaParticipacion_Insertar
        Task<RifaParticipacionResponse?> Obtener(int id);       // core.RifaParticipacion_ObtenerPorId
        Task<IEnumerable<RifaParticipacionListado>> Listar(RifaParticipacionFiltro filtro); // core.RifaParticipacion_Listar
        Task<bool> ActualizarEstado(int id, string estado);     // core.RifaParticipacion_ActualizarEstado
    }
}
