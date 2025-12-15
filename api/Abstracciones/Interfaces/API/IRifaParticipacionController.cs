using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace Abstracciones.Interfaces.API
{
    public interface IRifaParticipacionController
    {
        Task<IActionResult> Crear([FromBody] RifaParticipacionRequest body);
        Task<IActionResult> Listar(
            [FromQuery] string? q,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? sort = null);
        Task<IActionResult> Obtener([FromRoute] int id);
        Task<IActionResult> ActualizarEstado([FromRoute] int id, [FromBody] RifaParticipacionEstadoRequest body);
    }
}
