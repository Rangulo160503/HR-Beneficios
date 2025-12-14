using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IInfoBoardController
    {
        Task<IActionResult> Obtener([FromQuery] bool? activo, [FromQuery] string? q);
        Task<IActionResult> Obtener(Guid id);
        Task<IActionResult> Agregar(InfoBoardItemRequest item);
        Task<IActionResult> Editar(Guid id, InfoBoardItemRequest item);
        Task<IActionResult> Eliminar(Guid id);
    }
}
