using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IToqueBeneficioDA
    {
        Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen);
        Task<ToqueBeneficioAnalyticsResponse> ObtenerAnalytics(
            Guid beneficioId,
            DateTime desde,
            DateTime hasta,
            string granularity,
            DateTime prevDesde,
            DateTime prevHasta
        );

        Task<IEnumerable<ToqueBeneficioResumen>> ObtenerResumen(DateTime desde, DateTime hasta);
    }
}
