using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.Flujo
{
    public interface IToqueBeneficioFlujo
    {
        Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen);
        Task<ToqueBeneficioAnalyticsResponse> ObtenerAnalytics(Guid beneficioId, string? rango, string? granularity);
        Task<IEnumerable<ToqueBeneficioResumen>> ObtenerResumen(string? rango);
    }
}
