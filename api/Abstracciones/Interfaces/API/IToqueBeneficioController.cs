using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IToqueBeneficioController
    {
        Task<IActionResult> Registrar(ToqueBeneficioRequest request);
        Task<IActionResult> ObtenerAnalytics(Guid beneficioId, string? range, string? granularity);
        Task<IActionResult> ObtenerResumen(string? range);
    }
}
