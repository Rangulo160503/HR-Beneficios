using Abstracciones.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IBeneficioController
    {
        Task<IActionResult> Agregar(
            Guid proveedorId,
            string token,
            BeneficioRequest req,
            IFormFile? imagen);

        /*Task<IActionResult> Editar(
            Guid Id,
            BeneficioRequest req,
            IFormFile? imagen);
        */
        Task<IActionResult> Eliminar(Guid Id);

        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
        Task<IActionResult> ObtenerPendientes();
        Task<IActionResult> ObtenerRechazados();

        Task<IActionResult> Aprobar(Guid Id);
        Task<IActionResult> Rechazar(Guid Id);

        Task<IActionResult> ObtenerPorCategoria(
            Guid categoriaId,
            int page,
            int pageSize,
            string? search);

        Task<IActionResult> ReasignarCategoria(ReasignarCategoriaRequest body);
    }
}