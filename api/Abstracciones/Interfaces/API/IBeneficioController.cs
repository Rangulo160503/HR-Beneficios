using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IBeneficioController
    {
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> Agregar(BeneficioRequest beneficio, Guid proveedorId, string token);
        Task<IActionResult> Editar(Guid Id, BeneficioRequest beneficio);
        Task<IActionResult> Eliminar(Guid Id);
        Task<IActionResult> ObtenerPendientes();
        Task<IActionResult> Aprobar(Guid Id);
        Task<IActionResult> Rechazar(Guid Id);
        Task<IActionResult> ObtenerPorCategoria(Guid categoriaId, int page, int pageSize, string? search);
        Task<IActionResult> ReasignarCategoria(ReasignarCategoriaRequest request);
    }
}
