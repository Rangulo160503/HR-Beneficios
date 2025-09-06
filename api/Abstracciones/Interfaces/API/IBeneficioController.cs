using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IBeneficioController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(BeneficioRequest beneficio);
        Task<IActionResult> Editar(Guid Id, BeneficioRequest beneficio);
        Task<IActionResult> Eliminar(Guid Id);
    }
}
