using Abstracciones.Modelos;

namespace Abstracciones.Interfaces.DA
{
    public interface IToqueBeneficioDA
    {
        Task<ToqueBeneficio> Registrar(Guid beneficioId, string? origen);
        Task<IEnumerable<ToqueBeneficioDia>> ObtenerSeries(Guid beneficioId, DateTime desde, DateTime hasta);
    }
}
